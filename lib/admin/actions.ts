"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import * as email from "@/lib/notifications/email";
import * as whatsapp from "@/lib/notifications/whatsapp";
import { formatPrice } from "@/lib/formatters";

/**
 * Admin write layer. Every action calls requireAdmin() as its first statement,
 * so authorization is enforced at the action itself — never relying solely on a
 * page or middleware that could be misconfigured.
 */

export type Result = { ok: true; message?: string } | { ok: false; error: string };

function ok(message?: string): Result {
  return { ok: true, message };
}
function fail(error: string): Result {
  return { ok: false, error };
}

/**
 * Fires customer notifications without ever failing the admin action that
 * triggered them — the database write has already committed by this point, so a
 * bounced email must not surface as "could not update the order". Nulls are
 * allowed so callers can skip a channel inline (e.g. no phone on file).
 */
async function notifyQuietly(...tasks: (Promise<unknown> | null)[]): Promise<void> {
  const results = await Promise.allSettled(tasks.filter(Boolean) as Promise<unknown>[]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[admin notify] delivery failed:", result.reason);
    }
  }
}

/**
 * An optional numeric form field. A plain `z.coerce.number()` turns "" into 0,
 * so an untouched input would silently save as zero — this maps blank to
 * undefined before coercing.
 */
function optionalNumber(opts: { int?: boolean } = {}) {
  const base = opts.int ? z.coerce.number().int().min(0) : z.coerce.number().min(0);
  return z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    base.optional(),
  );
}

/** Turns a display name into a URL slug. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateAdmin(...extra: string[]) {
  revalidatePath("/admin");
  for (const path of extra) revalidatePath(path);
}

/**
 * Storefront pages are cached (ISR) rather than force-dynamic, so a write has
 * to explicitly bust every page that renders product data — otherwise an admin
 * edit would not show until the revalidate window expired.
 */
function revalidateStorefrontProducts() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/flowers");
  revalidatePath("/search");
  revalidatePath("/shop/[slug]", "page");
}

// ── ORDERS ────────────────────────────────────────────────────

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

// Customer-facing copy for each status. Kept beside the enum so a new status
// automatically requires a matching message (TS will flag a missing key).
const STATUS_MESSAGES: Record<(typeof ORDER_STATUSES)[number], (n: string) => string> = {
  PENDING: (n) => `Your Mahek Balloon order ${n} is being reviewed. We'll confirm shortly.`,
  CONFIRMED: (n) => `Your Mahek Balloon order ${n} is confirmed. We'll start preparing it.`,
  PROCESSING: (n) => `Your Mahek Balloon order ${n} is being prepared.`,
  READY_FOR_PICKUP: (n) =>
    `Your Mahek Balloon order ${n} is ready! Please collect it from our shop at Saras Baug, Pune. ` +
    `Directions: https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7`,
  SHIPPED: (n) => `Your Mahek Balloon order ${n} is out for delivery.`,
  DELIVERED: (n) => `Your Mahek Balloon order ${n} has been delivered. Thank you!`,
  COMPLETED: (n) => `Your Mahek Balloon order ${n} is complete. Hope you loved it — a review would mean the world.`,
  CANCELLED: (n) =>
    `Your Mahek Balloon order ${n} has been cancelled. Any advance paid will be refunded. Questions? Call +91 8087867988.`,
  REFUNDED: (n) => `Your Mahek Balloon order ${n} has been refunded.`,
};

const PAYMENT_STATUSES = ["PENDING", "PARTIALLY_PAID", "PAID", "FAILED", "REFUNDED"] as const;

export async function updateOrderStatus(id: string, status: string): Promise<Result> {
  await requireAdmin();
  const parsed = z.enum(ORDER_STATUSES).safeParse(status);
  if (!parsed.success) return fail("Invalid status");
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data,
        confirmedAt: parsed.data === "CONFIRMED" ? new Date() : undefined,
      },
      include: { customer: { select: { email: true, name: true } } },
    });

    const who = order.customerName ?? order.customer?.name ?? "there";
    const message = STATUS_MESSAGES[parsed.data](order.orderNumber);

    // Customer-facing notification on every meaningful transition. Skip the
    // PENDING baseline because the customer already sees it at checkout.
    if (parsed.data !== "PENDING") {
      await notifyQuietly(
        parsed.data === "CANCELLED"
          ? email.sendCancellationEmail({
              reference: order.orderNumber,
              customerName: who,
              customerEmail: order.customer?.email,
              kind: "order",
            })
          : email.sendOrderStatusEmail({
              orderNumber: order.orderNumber,
              customerName: who,
              customerEmail: order.customer?.email,
              status: parsed.data,
              message,
            }),
        order.customerPhone ? whatsapp.sendText(order.customerPhone, message) : null,
      );
    }

    revalidateAdmin("/admin/orders");
    return ok("Order updated");
  } catch (e) {
    console.error("[updateOrderStatus]", e);
    return fail("Could not update the order");
  }
}

export async function updateOrderPickup(
  id: string,
  pickupDate: string | null,
  pickupTime: string | null,
): Promise<Result> {
  await requireAdmin();
  try {
    const date =
      pickupDate && /^\d{4}-\d{2}-\d{2}$/.test(pickupDate)
        ? new Date(`${pickupDate}T00:00:00+05:30`)
        : null;
    const order = await prisma.order.update({
      where: { id },
      data: { pickupDate: date, pickupTime: pickupTime || null },
      include: { customer: { select: { email: true, name: true } } },
    });

    if (date) {
      const who = order.customerName ?? order.customer?.name ?? "there";
      const humanDate = date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const message =
        `Hi ${who}, your Mahek Balloon pickup slot for order ${order.orderNumber} has been ` +
        `set to ${humanDate}${pickupTime ? ` at ${pickupTime}` : ""}. ` +
        `Shop: Saras Baug, Pune — https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7`;
      await notifyQuietly(
        email.sendOrderStatusEmail({
          orderNumber: order.orderNumber,
          customerName: who,
          customerEmail: order.customer?.email,
          status: "Pickup rescheduled",
          message,
        }),
        order.customerPhone ? whatsapp.sendText(order.customerPhone, message) : null,
      );
    }

    revalidateAdmin("/admin/orders");
    return ok("Pickup updated");
  } catch (e) {
    console.error("[updateOrderPickup]", e);
    return fail("Could not update pickup slot");
  }
}

export async function updateOrderPayment(id: string, paymentStatus: string): Promise<Result> {
  await requireAdmin();
  const parsed = z.enum(PAYMENT_STATUSES).safeParse(paymentStatus);
  if (!parsed.success) return fail("Invalid payment status");
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: parsed.data,
        paidAt: parsed.data === "PAID" ? new Date() : undefined,
      },
      include: { customer: { select: { email: true, name: true } } },
    });

    if (parsed.data === "PAID" || parsed.data === "PARTIALLY_PAID") {
      const fullyPaid = parsed.data === "PAID";
      const amount = fullyPaid ? Number(order.total) : Number(order.advanceAmount);
      await notifyQuietly(
        email.sendPaymentReceivedEmail({
          reference: order.orderNumber,
          customerName: order.customerName ?? order.customer?.name ?? "there",
          customerEmail: order.customer?.email,
          amountPaid: amount,
          balanceDue: fullyPaid ? 0 : Number(order.balanceDue),
          fullyPaid,
        }),
        order.customerPhone
          ? whatsapp.sendText(
              order.customerPhone,
              `Mahek Balloon: we have received ${formatPrice(amount)} for order ${order.orderNumber}. ` +
                (fullyPaid
                  ? "Your order is paid in full. Thank you!"
                  : `Balance of ${formatPrice(Number(order.balanceDue))} is due on delivery.`),
            )
          : null,
      );
    }

    revalidateAdmin("/admin/orders");
    return ok("Payment updated");
  } catch (e) {
    console.error("[updateOrderPayment]", e);
    return fail("Could not update payment");
  }
}

// ── BOOKINGS ──────────────────────────────────────────────────

const BOOKING_STATUSES = ["NEW", "FOLLOW_UP", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export async function updateBookingStatus(id: string, status: string): Promise<Result> {
  await requireAdmin();
  const parsed = z.enum(BOOKING_STATUSES).safeParse(status);
  if (!parsed.success) return fail("Invalid status");
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: parsed.data,
        confirmedAt: parsed.data === "CONFIRMED" ? new Date() : undefined,
      },
      include: { customer: { select: { email: true, name: true } } },
    });

    const who = booking.customerName ?? booking.customer?.name ?? "there";

    if (parsed.data === "CONFIRMED") {
      await notifyQuietly(
        email.sendBookingConfirmedEmail({
          bookingNumber: booking.bookingNumber,
          customerName: who,
          customerEmail: booking.customer?.email,
          eventType: booking.eventType,
          eventDate: booking.eventDate?.toISOString().slice(0, 10) ?? null,
          quotedAmount: booking.quotedAmount ? Number(booking.quotedAmount) : null,
          advanceAmount: booking.advanceAmount ? Number(booking.advanceAmount) : null,
        }),
        booking.customerPhone
          ? whatsapp.sendText(
              booking.customerPhone,
              `Mahek Balloon: your ${booking.eventType} booking ${booking.bookingNumber} is CONFIRMED. ` +
                `We will call before the event to finalise setup timing.`,
            )
          : null,
      );
    }

    if (parsed.data === "CANCELLED") {
      await notifyQuietly(
        email.sendCancellationEmail({
          reference: booking.bookingNumber,
          customerName: who,
          customerEmail: booking.customer?.email,
          kind: "booking",
        }),
        booking.customerPhone
          ? whatsapp.sendText(
              booking.customerPhone,
              `Your Mahek Balloon booking ${booking.bookingNumber} has been cancelled. ` +
                `Questions? Call +91 8087867988.`,
            )
          : null,
      );
    }

    revalidateAdmin("/admin/bookings");
    return ok("Booking updated");
  } catch (e) {
    console.error("[updateBookingStatus]", e);
    return fail("Could not update the booking");
  }
}

const bookingQuoteSchema = z.object({
  quotedAmount: z.coerce.number().min(0),
  followUpDate: z.string().optional(),
});

export async function updateBookingQuote(id: string, formData: FormData): Promise<Result> {
  await requireAdmin();
  const parsed = bookingQuoteSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail("Enter a valid quote amount");
  try {
    await prisma.booking.update({
      where: { id },
      data: {
        quotedAmount: new Prisma.Decimal(parsed.data.quotedAmount),
        advanceAmount: new Prisma.Decimal(Math.round(parsed.data.quotedAmount * 0.5)),
        followUpDate: parsed.data.followUpDate ? new Date(parsed.data.followUpDate) : null,
      },
    });
    revalidateAdmin("/admin/bookings");
    return ok("Quote saved");
  } catch (e) {
    console.error("[updateBookingQuote]", e);
    return fail("Could not save the quote");
  }
}

// ── PRODUCTS ──────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  categoryId: z.string().min(1, "Choose a category"),
  basePrice: z.coerce.number().min(0, "Price must be 0 or more"),
  salePrice: optionalNumber(),
  stock: z.coerce.number().int().min(0).default(0),
  shortDesc: z.string().max(255).optional(),
  description: z.string().max(5000).optional(),
  sku: z.string().max(64).optional(),
  images: z.string().optional(), // newline/comma separated URLs
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
  isFeatured: z.union([z.literal("on"), z.literal("")]).optional(),
});

/**
 * Splits on newlines ONLY. A base64 data URL contains a comma
 * ("data:image/jpeg;base64,/9j/...") so splitting on commas — as this used to —
 * tore every uploaded image into two broken fragments. The uploader always
 * joins with newlines, so that is the only separator we need.
 */
function parseImages(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveProduct(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the product fields");
  }
  const d = parsed.data;
  const data = {
    name: d.name,
    categoryId: d.categoryId,
    basePrice: new Prisma.Decimal(d.basePrice),
    salePrice: d.salePrice !== undefined ? new Prisma.Decimal(d.salePrice) : null,
    stock: d.stock,
    shortDesc: d.shortDesc || null,
    description: d.description || null,
    sku: d.sku || null,
    images: parseImages(d.images),
    isActive: d.isActive === "on",
    isFeatured: d.isFeatured === "on",
  };

  try {
    if (id) {
      await prisma.product.update({ where: { id }, data });
    } else {
      let slug = slugify(d.name);
      const clash = await prisma.product.findUnique({ where: { slug } });
      if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
      await prisma.product.create({ data: { ...data, slug } });
    }
    revalidateAdmin("/admin/products");
    revalidateStorefrontProducts();
    return ok(id ? "Product updated" : "Product created");
  } catch (e) {
    console.error("[saveProduct]", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("A product with that SKU already exists");
    }
    return fail("Could not save the product");
  }
}

export async function deleteProduct(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
    revalidateAdmin("/admin/products");
    revalidateStorefrontProducts();
    return ok("Product deleted");
  } catch (e) {
    console.error("[deleteProduct]", e);
    return fail("Could not delete — it may be attached to existing orders");
  }
}

export async function toggleProductActive(id: string, isActive: boolean): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.product.update({ where: { id }, data: { isActive } });
    revalidateAdmin("/admin/products");
    revalidateStorefrontProducts();
    return ok(isActive ? "Product published" : "Product hidden");
  } catch (e) {
    console.error("[toggleProductActive]", e);
    return fail("Could not update the product");
  }
}

// ── CATEGORIES ────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  type: z.enum(["PRODUCT", "SERVICE", "EVENT"]).default("PRODUCT"),
  description: z.string().max(1000).optional(),
  image: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function saveCategory(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  // Uploader stores a newline-joined list; a category holds a single image.
  if (typeof raw.image === "string") raw.image = raw.image.split("\n")[0]?.trim() ?? "";
  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the category fields");
  const d = parsed.data;
  const data = {
    name: d.name,
    type: d.type,
    description: d.description || null,
    image: d.image || null,
    sortOrder: d.sortOrder,
    isActive: d.isActive === "on",
  };
  try {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      let slug = slugify(d.name);
      const clash = await prisma.category.findUnique({ where: { slug } });
      if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
      await prisma.category.create({ data: { ...data, slug } });
    }
    revalidateAdmin("/admin/products");
    revalidateStorefrontProducts();
    revalidatePath("/", "layout");
    return ok(id ? "Category updated" : "Category created");
  } catch (e) {
    console.error("[saveCategory]", e);
    return fail("Could not save the category");
  }
}

export async function deleteCategory(id: string): Promise<Result> {
  await requireAdmin();
  try {
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) return fail(`Move or delete the ${count} product(s) in this category first`);
    await prisma.category.delete({ where: { id } });
    revalidateAdmin("/admin/products");
    revalidateStorefrontProducts();
    return ok("Category deleted");
  } catch (e) {
    console.error("[deleteCategory]", e);
    return fail("Could not delete the category");
  }
}

// ── COUPONS ───────────────────────────────────────────────────

const couponSchema = z.object({
  code: z.string().trim().min(3, "Code must be at least 3 characters"),
  type: z.enum(["PERCENTAGE", "FIXED"]).default("PERCENTAGE"),
  value: z.coerce.number().min(0, "Value must be 0 or more"),
  minOrder: optionalNumber(),
  usageLimit: optionalNumber({ int: true }),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function saveCoupon(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const parsed = couponSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the coupon fields");
  const d = parsed.data;
  const data = {
    code: d.code.toUpperCase(),
    type: d.type,
    value: new Prisma.Decimal(d.value),
    minOrder: d.minOrder !== undefined ? new Prisma.Decimal(d.minOrder) : null,
    usageLimit: d.usageLimit !== undefined ? d.usageLimit : null,
    isActive: d.isActive === "on",
  };
  try {
    if (id) {
      await prisma.coupon.update({ where: { id }, data });
    } else {
      await prisma.coupon.create({ data });
    }
    revalidateAdmin("/admin/coupons");
    return ok(id ? "Coupon updated" : "Coupon created");
  } catch (e) {
    console.error("[saveCoupon]", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return fail("That coupon code already exists");
    }
    return fail("Could not save the coupon");
  }
}

export async function deleteCoupon(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.coupon.delete({ where: { id } });
    revalidateAdmin("/admin/coupons");
    return ok("Coupon deleted");
  } catch (e) {
    console.error("[deleteCoupon]", e);
    return fail("Could not delete the coupon");
  }
}

// ── REVIEW VIDEOS ─────────────────────────────────────────────

/**
 * A URL that the browser can render as video. Accepts:
 *  - `/api/media/<id>` from the built-in uploader (Supabase-backed, cached),
 *  - a Cloudinary/other https MP4 or a YouTube watch/embed URL.
 * That keeps the model open to moving off Supabase byte storage without a
 * schema change.
 */
const videoUrlSchema = z
  .string()
  .trim()
  .min(1, "Add a video")
  .refine(
    (v) =>
      v.startsWith("/api/media/") ||
      /^https?:\/\//i.test(v) ||
      v.startsWith("/"),
    "Enter a valid video URL",
  );

const reviewVideoSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required"),
  eventType: z.string().trim().min(1, "Event type is required"),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  reviewText: z.string().max(2000).optional(),
  videoUrl: videoUrlSchema,
  poster: z.string().trim().optional(),
  duration: optionalNumber({ int: true }),
  isFeatured: z.union([z.literal("on"), z.literal("")]).optional(),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
  sortOrder: z.coerce.number().int().default(0),
});

function firstUrl(raw?: string): string {
  if (!raw) return "";
  return raw.split("\n")[0]?.trim() ?? "";
}

export async function saveReviewVideo(
  id: string | null,
  formData: FormData,
): Promise<Result> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  // The uploader writes a newline-joined list; a review has one video and one
  // poster.
  if (typeof raw.videoUrl === "string") raw.videoUrl = firstUrl(raw.videoUrl);
  if (typeof raw.poster === "string") raw.poster = firstUrl(raw.poster);
  const parsed = reviewVideoSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the review fields");
  }
  const d = parsed.data;
  const data = {
    customerName: d.customerName,
    eventType: d.eventType,
    rating: d.rating,
    reviewText: d.reviewText || null,
    videoUrl: d.videoUrl,
    poster: d.poster || null,
    duration: d.duration ?? null,
    isFeatured: d.isFeatured === "on",
    isActive: d.isActive === "on",
    sortOrder: d.sortOrder,
  };
  try {
    if (id) {
      await prisma.reviewVideo.update({ where: { id }, data });
    } else {
      await prisma.reviewVideo.create({ data });
    }
    revalidateAdmin("/admin/review-videos", "/", "/reviews");
    return ok(id ? "Review updated" : "Review added");
  } catch (e) {
    console.error("[saveReviewVideo]", e);
    return fail("Could not save the review");
  }
}

export async function deleteReviewVideo(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.reviewVideo.delete({ where: { id } });
    revalidateAdmin("/admin/review-videos", "/", "/reviews");
    return ok("Review deleted");
  } catch (e) {
    console.error("[deleteReviewVideo]", e);
    return fail("Could not delete the review");
  }
}

export async function toggleReviewVideoActive(
  id: string,
  isActive: boolean,
): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.reviewVideo.update({ where: { id }, data: { isActive } });
    revalidateAdmin("/admin/review-videos", "/", "/reviews");
    return ok(isActive ? "Review shown" : "Review hidden");
  } catch (e) {
    console.error("[toggleReviewVideoActive]", e);
    return fail("Could not update the review");
  }
}

export async function toggleReviewVideoFeatured(
  id: string,
  isFeatured: boolean,
): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.reviewVideo.update({ where: { id }, data: { isFeatured } });
    revalidateAdmin("/admin/review-videos", "/", "/reviews");
    return ok(isFeatured ? "Marked as featured" : "Removed from featured");
  } catch (e) {
    console.error("[toggleReviewVideoFeatured]", e);
    return fail("Could not update the review");
  }
}

/**
 * Persist a drag-and-drop ordering. `ids` is the array in the new visual
 * order; the row at position N gets `sortOrder = N`.
 */
export async function reorderReviewVideos(ids: string[]): Promise<Result> {
  await requireAdmin();
  if (!Array.isArray(ids) || ids.length === 0) return fail("Nothing to reorder");
  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.reviewVideo.update({ where: { id }, data: { sortOrder: index } }),
      ),
    );
    revalidateAdmin("/admin/review-videos", "/", "/reviews");
    return ok("Order saved");
  } catch (e) {
    console.error("[reorderReviewVideos]", e);
    return fail("Could not save the order");
  }
}

// ── GALLERY ───────────────────────────────────────────────────

const gallerySchema = z.object({
  title: z.string().max(200).optional(),
  image: z.string().min(1, "Add an image or video"),
  mediaType: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
  poster: z.string().optional(),
  category: z.string().trim().min(1, "Choose a category").default("all"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function saveGalleryImage(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  // The uploader stores newline-joined values; a gallery slot holds one item.
  if (typeof raw.image === "string") raw.image = raw.image.split("\n")[0]?.trim() ?? "";
  if (typeof raw.poster === "string") raw.poster = raw.poster.split("\n")[0]?.trim() ?? "";
  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the gallery fields");
  const d = parsed.data;
  const data = {
    title: d.title || null,
    image: d.image,
    mediaType: d.mediaType,
    poster: d.poster || null,
    category: d.category,
    sortOrder: d.sortOrder,
    isActive: d.isActive === "on",
  };
  try {
    if (id) {
      await prisma.galleryImage.update({ where: { id }, data });
    } else {
      await prisma.galleryImage.create({ data });
    }
    revalidateAdmin("/admin/gallery", "/gallery", "/videos", "/");
    return ok(id ? "Image updated" : "Image added");
  } catch (e) {
    console.error("[saveGalleryImage]", e);
    return fail("Could not save the image");
  }
}

export async function deleteGalleryImage(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.galleryImage.delete({ where: { id } });
    revalidateAdmin("/admin/gallery", "/gallery", "/videos", "/");
    return ok("Image deleted");
  } catch (e) {
    console.error("[deleteGalleryImage]", e);
    return fail("Could not delete the image");
  }
}

export async function toggleGalleryActive(id: string, isActive: boolean): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.galleryImage.update({ where: { id }, data: { isActive } });
    revalidateAdmin("/admin/gallery", "/gallery", "/videos", "/");
    return ok(isActive ? "Image shown" : "Image hidden");
  } catch (e) {
    console.error("[toggleGalleryActive]", e);
    return fail("Could not update the image");
  }
}

// ── OFFERS ────────────────────────────────────────────────────

const offerSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  badge: z.string().max(60).optional(),
  subtitle: z.string().max(300).optional(),
  description: z.string().max(5000).optional(),
  image: z.string().optional(),
  discountLabel: z.string().max(60).optional(),
  couponCode: z.string().max(40).optional(),
  ctaLabel: z.string().max(40).optional(),
  ctaHref: z.string().max(200).optional(),
  categorySlug: z.string().max(80).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function saveOffer(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  if (typeof raw.image === "string") raw.image = raw.image.split("\n")[0]?.trim() ?? "";
  const parsed = offerSchema.safeParse(raw);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the offer fields");
  const d = parsed.data;
  const data = {
    title: d.title,
    badge: d.badge || null,
    subtitle: d.subtitle || null,
    description: d.description || null,
    image: d.image || null,
    discountLabel: d.discountLabel || null,
    couponCode: d.couponCode ? d.couponCode.toUpperCase() : null,
    ctaLabel: d.ctaLabel || null,
    ctaHref: d.ctaHref || null,
    categorySlug: d.categorySlug || null,
    startDate: d.startDate ? new Date(d.startDate) : null,
    endDate: d.endDate ? new Date(d.endDate) : null,
    sortOrder: d.sortOrder,
    isActive: d.isActive === "on",
  };
  try {
    if (id) {
      await prisma.offer.update({ where: { id }, data });
    } else {
      let slug = slugify(d.title);
      const clash = await prisma.offer.findUnique({ where: { slug } });
      if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
      await prisma.offer.create({ data: { ...data, slug } });
    }
    revalidateAdmin("/admin/offers", "/offers", "/");
    return ok(id ? "Offer updated" : "Offer created");
  } catch (e) {
    console.error("[saveOffer]", e);
    return fail("Could not save the offer");
  }
}

export async function deleteOffer(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.offer.delete({ where: { id } });
    revalidateAdmin("/admin/offers", "/offers", "/");
    return ok("Offer deleted");
  } catch (e) {
    console.error("[deleteOffer]", e);
    return fail("Could not delete the offer");
  }
}

export async function toggleOfferActive(id: string, isActive: boolean): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.offer.update({ where: { id }, data: { isActive } });
    revalidateAdmin("/admin/offers", "/offers", "/");
    return ok(isActive ? "Offer published" : "Offer hidden");
  } catch (e) {
    console.error("[toggleOfferActive]", e);
    return fail("Could not update the offer");
  }
}

// ── REVIEWS ───────────────────────────────────────────────────

export async function setReviewVerified(id: string, isVerified: boolean): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.review.update({ where: { id }, data: { isVerified } });
    revalidateAdmin("/admin/reviews");
    return ok(isVerified ? "Review approved" : "Review unapproved");
  } catch (e) {
    console.error("[setReviewVerified]", e);
    return fail("Could not update the review");
  }
}

export async function deleteReview(id: string): Promise<Result> {
  await requireAdmin();
  try {
    await prisma.review.delete({ where: { id } });
    revalidateAdmin("/admin/reviews");
    return ok("Review deleted");
  } catch (e) {
    console.error("[deleteReview]", e);
    return fail("Could not delete the review");
  }
}

// ── SETTINGS ──────────────────────────────────────────────────

const SETTING_KEYS = [
  "businessName",
  "tagline",
  "email",
  "phone",
  "whatsapp",
  "address",
  "instagram",
  "facebook",
  "deliveryRadiusKm",
  "freeDeliveryAbove",
  "seoTitle",
  "seoDescription",
] as const;

export async function saveSettings(formData: FormData): Promise<Result> {
  await requireAdmin();
  try {
    const entries = SETTING_KEYS.map((key) => ({
      key,
      value: String(formData.get(key) ?? "").slice(0, 2000),
    }));
    await prisma.$transaction(
      entries.map((e) =>
        prisma.setting.upsert({
          where: { key: e.key },
          update: { value: e.value },
          create: { key: e.key, value: e.value },
        }),
      ),
    );
    revalidateAdmin("/admin/settings");
    revalidatePath("/", "layout");
    return ok("Settings saved");
  } catch (e) {
    console.error("[saveSettings]", e);
    return fail("Could not save settings");
  }
}
