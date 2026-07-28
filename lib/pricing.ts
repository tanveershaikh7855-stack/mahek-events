import "server-only";
import { prisma } from "./prisma";
import { env } from "./env";
import { FALLBACK_DELIVERY_CHARGES } from "./seed";
import type { CartItem } from "./validators";

/**
 * Authoritative server-side pricing.
 *
 * The old checkout computed `subtotal` from the `price` field the browser sent,
 * so anyone could POST a cart claiming a ₹5,000 balloon arch cost ₹1 and the
 * order would be written at that price. Nothing here trusts the client beyond
 * product IDs and quantities — every rupee is re-read from the database.
 */

/** Rounds to 2dp without binary-float drift (0.1 + 0.2 style errors). */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type PricedLine = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  variant: string | null;
};

export type PricingResult = {
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  gst: number;
  total: number;
  advancePercent: number;
  advanceAmount: number;
  balanceDue: number;
  couponId: string | null;
  couponCode: string | null;
};

export class PricingError extends Error {
  constructor(
    message: string,
    readonly code:
      | "EMPTY_CART"
      | "PRODUCT_UNAVAILABLE"
      | "INSUFFICIENT_STOCK"
      | "INVALID_QUANTITY",
  ) {
    super(message);
    this.name = "PricingError";
  }
}

const MAX_QTY_PER_LINE = 50;

function deliveryFor(distanceKm: number, orderValue: number): number {
  const slab = FALLBACK_DELIVERY_CHARGES.find(
    (c) => distanceKm >= c.minDistance && distanceKm <= c.maxDistance,
  );
  if (!slab) return 499;
  if (slab.freeAbove && orderValue >= Number(slab.freeAbove)) return 0;
  return Number(slab.charge);
}

/**
 * Validates a coupon against the DB and returns the discount in rupees.
 * Returns 0 for anything expired, exhausted, inactive or below its minimum —
 * previously `couponCode` was accepted by the schema and then silently ignored,
 * so customers who entered a valid code were still charged full price.
 */
async function resolveCoupon(
  code: string | undefined,
  subtotal: number,
): Promise<{ id: string | null; code: string | null; discount: number }> {
  if (!code?.trim()) return { id: null, code: null, discount: 0 };

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.isActive) return { id: null, code: null, discount: 0 };

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return { id: null, code: null, discount: 0 };
  }
  if (coupon.endDate && now > coupon.endDate) {
    return { id: null, code: null, discount: 0 };
  }
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    return { id: null, code: null, discount: 0 };
  }
  if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
    return { id: null, code: null, discount: 0 };
  }

  let discount =
    coupon.type === "PERCENTAGE"
      ? (subtotal * Number(coupon.value)) / 100
      : Number(coupon.value);

  if (coupon.maxDiscount) {
    discount = Math.min(discount, Number(coupon.maxDiscount));
  }

  // Never let a coupon exceed the cart value.
  discount = Math.min(discount, subtotal);

  return { id: coupon.id, code: coupon.code, discount: round2(discount) };
}

export async function priceCart(options: {
  items: CartItem[];
  couponCode?: string;
  distanceKm?: number;
}): Promise<PricingResult> {
  const { items, couponCode, distanceKm = 10 } = options;

  if (!items.length) {
    throw new PricingError("Your cart is empty", "EMPTY_CART");
  }

  // Collapse duplicate lines so a repeated productId cannot bypass stock checks.
  const wanted = new Map<string, { quantity: number; variant: string | null }>();
  for (const item of items) {
    const qty = Math.floor(item.quantity);
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      throw new PricingError(
        `Invalid quantity for one of your items`,
        "INVALID_QUANTITY",
      );
    }
    const existing = wanted.get(item.productId);
    wanted.set(item.productId, {
      quantity: (existing?.quantity ?? 0) + qty,
      variant: item.variant ?? existing?.variant ?? null,
    });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: [...wanted.keys()] }, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      basePrice: true,
      salePrice: true,
      stock: true,
    },
  });

  const byId = new Map(products.map((p) => [p.id, p]));

  const lines: PricedLine[] = [];
  for (const [productId, { quantity, variant }] of wanted) {
    const product = byId.get(productId);
    if (!product) {
      throw new PricingError(
        "One of the items in your cart is no longer available",
        "PRODUCT_UNAVAILABLE",
      );
    }
    if (product.stock < quantity) {
      throw new PricingError(
        `Only ${product.stock} left of "${product.name}"`,
        "INSUFFICIENT_STOCK",
      );
    }

    // Sale price wins when present — this is the price of record, not the
    // number the browser claimed.
    const unitPrice = round2(
      Number(product.salePrice ?? product.basePrice),
    );
    const images = Array.isArray(product.images) ? product.images : [];

    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: typeof images[0] === "string" ? images[0] : "",
      unitPrice,
      quantity,
      lineTotal: round2(unitPrice * quantity),
      variant,
    });
  }

  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0));
  const coupon = await resolveCoupon(couponCode, subtotal);
  const taxable = round2(subtotal - coupon.discount);

  // Delivery was previously left out of the total entirely — the comment said
  // "delivery handled client side", which meant every order under-charged.
  const deliveryCharge = round2(deliveryFor(distanceKm, taxable));
  const gst = round2(taxable * env.GST_RATE);
  const total = round2(taxable + deliveryCharge + gst);

  const advancePercent = env.ADVANCE_PERCENT;
  const advanceAmount = round2((total * advancePercent) / 100);
  const balanceDue = round2(total - advanceAmount);

  return {
    lines,
    subtotal,
    discount: coupon.discount,
    deliveryCharge,
    gst,
    total,
    advancePercent,
    advanceAmount,
    balanceDue,
    couponId: coupon.id,
    couponCode: coupon.code,
  };
}
