import "server-only";
import { prisma } from "@/lib/prisma";
import type { ToolDecl } from "./agent";
import {
  saveProduct,
  toggleProductActive,
  deleteProduct,
  saveService,
  toggleServiceActive,
  deleteService,
  saveCoupon,
  saveOffer,
  saveAbout,
} from "@/lib/admin/actions";

/**
 * Executable admin tools for the AI assistant. Each tool is a real database
 * write routed through the existing admin server actions, so validation,
 * revalidation and customer notifications behave exactly as they do when a human
 * clicks the form. Destructive tools (delete) require an explicit confirm flag —
 * the system prompt instructs the model to ask the admin first.
 */

// ── helpers ────────────────────────────────────────────────────

/** Coerce a Prisma Json column (string[] stored as Json) into newline text. */
function linesFromJson(v: unknown): string {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").join("\n") : "";
}

/** Build a FormData from a plain object (checkboxes use the string "on"/""). */
function fd(obj: Record<string, string | number | undefined>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) f.set(k, String(v));
  }
  return f;
}

async function findCategoryId(name?: string): Promise<string | null> {
  if (!name) {
    const first = await prisma.category.findFirst({
      where: { type: "PRODUCT" },
      orderBy: { sortOrder: "asc" },
    });
    return first?.id ?? null;
  }
  const cats = await prisma.category.findMany({ select: { id: true, name: true } });
  const q = name.toLowerCase();
  const exact = cats.find((c) => c.name.toLowerCase() === q);
  const partial = cats.find((c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase()));
  return (exact ?? partial)?.id ?? null;
}

async function findProduct(query: string) {
  const q = query.trim();
  const byId = await prisma.product.findUnique({ where: { id: q } }).catch(() => null);
  if (byId) return byId;
  const rows = await prisma.product.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 2,
  });
  return rows.length === 1 ? rows[0] : rows.length === 0 ? null : "AMBIGUOUS";
}

async function findService(query: string) {
  const q = query.trim();
  const rows = await prisma.service.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 2,
  });
  return rows.length === 1 ? rows[0] : rows.length === 0 ? null : "AMBIGUOUS";
}

// ── tool declarations (what the model sees) ────────────────────

export const TOOL_DECLS: ToolDecl[] = [
  {
    name: "list_categories",
    description: "List all product/service categories with their names. Use before creating a product if unsure which category to assign.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "find_products",
    description: "Search products by name (case-insensitive substring). Returns matches with id, price, stock and visibility. Use this to locate a product before editing/deleting.",
    parameters: {
      type: "object",
      properties: { query: { type: "string", description: "Part of the product name" } },
      required: ["query"],
    },
  },
  {
    name: "create_product",
    description: "Create a new product in the catalogue. It becomes visible on the storefront immediately unless active=false.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        category: { type: "string", description: "Category name, e.g. 'Helium Balloons'. Optional; a default is used if omitted." },
        price: { type: "number", description: "Base price in INR" },
        salePrice: { type: "number", description: "Optional discounted price in INR" },
        stock: { type: "number", description: "Units in stock, default 0" },
        shortDesc: { type: "string", description: "One-line summary for cards" },
        description: { type: "string", description: "Full description" },
        active: { type: "boolean", description: "Show on site, default true" },
        featured: { type: "boolean", description: "Feature on homepage, default false" },
      },
      required: ["name", "price"],
    },
  },
  {
    name: "update_product",
    description: "Update fields of an existing product. Only pass the fields you want to change. Find the product by name or id.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Product name or id to edit" },
        name: { type: "string" },
        category: { type: "string" },
        price: { type: "number" },
        salePrice: { type: "number" },
        stock: { type: "number" },
        shortDesc: { type: "string" },
        description: { type: "string" },
        featured: { type: "boolean" },
      },
      required: ["query"],
    },
  },
  {
    name: "set_product_visibility",
    description: "Show or hide a product on the storefront without deleting it.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Product name or id" },
        active: { type: "boolean", description: "true = visible, false = hidden" },
      },
      required: ["query", "active"],
    },
  },
  {
    name: "delete_product",
    description: "Permanently delete a product. DESTRUCTIVE. You must confirm with the admin in chat first, then call with confirm=true.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Product name or id" },
        confirm: { type: "boolean", description: "Must be true to actually delete" },
      },
      required: ["query", "confirm"],
    },
  },
  {
    name: "find_services",
    description: "Search decoration services by name. Returns id, price and visibility.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
  },
  {
    name: "create_service",
    description: "Create a new decoration service shown on the Services page.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        priceFrom: { type: "number", description: "Starting price in INR" },
        features: { type: "array", items: { type: "string" }, description: "Bullet points of what's included" },
        active: { type: "boolean", description: "Show on site, default true" },
      },
      required: ["name", "description", "priceFrom"],
    },
  },
  {
    name: "update_service",
    description: "Update an existing service. Only pass fields to change.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Service name or id" },
        name: { type: "string" },
        description: { type: "string" },
        priceFrom: { type: "number" },
        features: { type: "array", items: { type: "string" } },
      },
      required: ["query"],
    },
  },
  {
    name: "set_service_visibility",
    description: "Show or hide a service on the storefront.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        active: { type: "boolean" },
      },
      required: ["query", "active"],
    },
  },
  {
    name: "delete_service",
    description: "Permanently delete a decoration service. DESTRUCTIVE. Confirm with the admin first, then call with confirm=true.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Service name or id" },
        confirm: { type: "boolean", description: "Must be true to actually delete" },
      },
      required: ["query", "confirm"],
    },
  },
  {
    name: "create_coupon",
    description: "Create a discount coupon code.",
    parameters: {
      type: "object",
      properties: {
        code: { type: "string", description: "Coupon code, e.g. DIWALI20" },
        type: { type: "string", enum: ["PERCENTAGE", "FIXED"], description: "PERCENTAGE or FIXED amount" },
        value: { type: "number", description: "Percent (e.g. 20) or rupee amount depending on type" },
        minOrder: { type: "number", description: "Minimum order value in INR (optional)" },
        usageLimit: { type: "number", description: "Max total uses (optional)" },
      },
      required: ["code", "type", "value"],
    },
  },
  {
    name: "create_offer",
    description: "Create a promotional offer/banner shown on the Offers page and homepage.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        subtitle: { type: "string" },
        description: { type: "string" },
        discountLabel: { type: "string", description: "e.g. 'Up to 30% off'" },
        couponCode: { type: "string" },
        ctaLabel: { type: "string" },
        ctaHref: { type: "string" },
      },
      required: ["title"],
    },
  },
  {
    name: "update_about_page",
    description: "Update the About page content and the stats numbers (years of experience, happy customers, etc).",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        highlight: { type: "string" },
        description: { type: "string" },
        yearsExperience: { type: "string", description: "e.g. '30+'" },
        happyCustomers: { type: "string" },
        eventsDecorated: { type: "string" },
        awardsWon: { type: "string" },
        ctaTitle: { type: "string" },
        ctaSubtitle: { type: "string" },
      },
      required: [],
    },
  },
  {
    name: "get_stats",
    description: "Get today's live shop numbers: orders, bookings, active products, low stock, customers.",
    parameters: { type: "object", properties: {} },
  },
];

// ── executor ───────────────────────────────────────────────────

type Args = Record<string, unknown>;
const str = (v: unknown) => (v === undefined || v === null ? undefined : String(v));
const num = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : Number(v));
const bool = (v: unknown) => v === true || v === "true";
const onOff = (v: unknown, dflt: boolean) => ((v === undefined ? dflt : bool(v)) ? "on" : "");

export async function runTool(name: string, args: Args): Promise<unknown> {
  switch (name) {
    case "list_categories": {
      const cats = await prisma.category.findMany({
        select: { name: true, type: true },
        orderBy: { sortOrder: "asc" },
      });
      return { categories: cats };
    }

    case "find_products": {
      const rows = await prisma.product.findMany({
        where: { name: { contains: String(args.query ?? ""), mode: "insensitive" } },
        select: { id: true, name: true, basePrice: true, salePrice: true, stock: true, isActive: true },
        take: 8,
      });
      return {
        count: rows.length,
        products: rows.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.basePrice),
          salePrice: p.salePrice ? Number(p.salePrice) : null,
          stock: p.stock,
          active: p.isActive,
        })),
      };
    }

    case "create_product": {
      const categoryId = await findCategoryId(str(args.category));
      if (!categoryId) return { error: "No product category exists yet. Create a category in the admin panel first." };
      const res = await saveProduct(
        null,
        fd({
          name: str(args.name),
          categoryId,
          basePrice: num(args.price),
          salePrice: num(args.salePrice),
          stock: num(args.stock) ?? 0,
          shortDesc: str(args.shortDesc),
          description: str(args.description),
          isActive: onOff(args.active, true),
          isFeatured: onOff(args.featured, false),
        }),
      );
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "update_product": {
      const found = await findProduct(String(args.query ?? ""));
      if (found === "AMBIGUOUS") return { error: "Multiple products match that name — be more specific." };
      if (!found) return { error: "No product found matching that name." };
      const categoryId = args.category ? await findCategoryId(str(args.category)) : found.categoryId;
      const res = await saveProduct(
        found.id,
        fd({
          name: str(args.name) ?? found.name,
          categoryId: categoryId ?? found.categoryId,
          basePrice: num(args.price) ?? Number(found.basePrice),
          salePrice: num(args.salePrice) ?? (found.salePrice ? Number(found.salePrice) : undefined),
          stock: num(args.stock) ?? found.stock,
          shortDesc: str(args.shortDesc) ?? found.shortDesc ?? undefined,
          description: str(args.description) ?? found.description ?? undefined,
          images: linesFromJson(found.images),
          isActive: found.isActive ? "on" : "",
          isFeatured: args.featured !== undefined ? onOff(args.featured, false) : found.isFeatured ? "on" : "",
        }),
      );
      return res.ok ? { ok: true, message: `Updated "${found.name}"` } : { error: res.error };
    }

    case "set_product_visibility": {
      const found = await findProduct(String(args.query ?? ""));
      if (found === "AMBIGUOUS") return { error: "Multiple products match — be more specific." };
      if (!found) return { error: "No product found." };
      const res = await toggleProductActive(found.id, bool(args.active));
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "delete_product": {
      if (!bool(args.confirm)) return { error: "Not confirmed. Ask the admin to confirm, then call again with confirm=true." };
      const found = await findProduct(String(args.query ?? ""));
      if (found === "AMBIGUOUS") return { error: "Multiple products match — be more specific." };
      if (!found) return { error: "No product found." };
      const res = await deleteProduct(found.id);
      return res.ok ? { ok: true, message: `Deleted "${found.name}"` } : { error: res.error };
    }

    case "find_services": {
      const rows = await prisma.service.findMany({
        where: { name: { contains: String(args.query ?? ""), mode: "insensitive" } },
        select: { id: true, name: true, priceFrom: true, isActive: true },
        take: 8,
      });
      return {
        count: rows.length,
        services: rows.map((s) => ({ id: s.id, name: s.name, priceFrom: Number(s.priceFrom), active: s.isActive })),
      };
    }

    case "create_service": {
      const features = Array.isArray(args.features) ? (args.features as string[]).join("\n") : str(args.features);
      const res = await saveService(
        null,
        fd({
          name: str(args.name),
          description: str(args.description),
          priceFrom: num(args.priceFrom),
          features,
          isActive: onOff(args.active, true),
        }),
      );
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "update_service": {
      const found = await findService(String(args.query ?? ""));
      if (found === "AMBIGUOUS") return { error: "Multiple services match — be more specific." };
      if (!found) return { error: "No service found." };
      const features = Array.isArray(args.features)
        ? (args.features as string[]).join("\n")
        : linesFromJson(found.features);
      const res = await saveService(
        found.id,
        fd({
          name: str(args.name) ?? found.name,
          description: str(args.description) ?? found.description,
          priceFrom: num(args.priceFrom) ?? Number(found.priceFrom),
          features,
          images: linesFromJson(found.images),
          isActive: found.isActive ? "on" : "",
        }),
      );
      return res.ok ? { ok: true, message: `Updated "${found.name}"` } : { error: res.error };
    }

    case "set_service_visibility": {
      const found = await findService(String(args.query ?? ""));
      if (found === "AMBIGUOUS") return { error: "Multiple services match — be more specific." };
      if (!found) return { error: "No service found." };
      const res = await toggleServiceActive(found.id, bool(args.active));
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "delete_service": {
      if (!bool(args.confirm)) return { error: "Not confirmed. Ask the admin to confirm, then call again with confirm=true." };
      const found = await findService(String(args.query ?? ""));
      if (found === "AMBIGUOUS") return { error: "Multiple services match — be more specific." };
      if (!found) return { error: "No service found." };
      const res = await deleteService(found.id);
      return res.ok ? { ok: true, message: `Deleted "${found.name}"` } : { error: res.error };
    }

    case "create_coupon": {
      const res = await saveCoupon(
        null,
        fd({
          code: str(args.code),
          type: str(args.type) ?? "PERCENTAGE",
          value: num(args.value),
          minOrder: num(args.minOrder),
          usageLimit: num(args.usageLimit),
          isActive: "on",
        }),
      );
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "create_offer": {
      const res = await saveOffer(
        null,
        fd({
          title: str(args.title),
          subtitle: str(args.subtitle),
          description: str(args.description),
          discountLabel: str(args.discountLabel),
          couponCode: str(args.couponCode),
          ctaLabel: str(args.ctaLabel),
          ctaHref: str(args.ctaHref),
          isActive: "on",
        }),
      );
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "update_about_page": {
      const existing = await prisma.aboutPage.findUnique({ where: { id: "main" } }).catch(() => null);
      const res = await saveAbout(
        fd({
          title: str(args.title) ?? existing?.title ?? undefined,
          highlight: str(args.highlight) ?? existing?.highlight ?? undefined,
          description: str(args.description) ?? existing?.description ?? undefined,
          storyImage: existing?.storyImage ?? undefined,
          story: linesFromJson(existing?.story),
          yearsExperience: str(args.yearsExperience) ?? existing?.yearsExperience ?? undefined,
          happyCustomers: str(args.happyCustomers) ?? existing?.happyCustomers ?? undefined,
          eventsDecorated: str(args.eventsDecorated) ?? existing?.eventsDecorated ?? undefined,
          awardsWon: str(args.awardsWon) ?? existing?.awardsWon ?? undefined,
          ctaTitle: str(args.ctaTitle) ?? existing?.ctaTitle ?? undefined,
          ctaSubtitle: str(args.ctaSubtitle) ?? existing?.ctaSubtitle ?? undefined,
        }),
      );
      return res.ok ? { ok: true, message: res.message } : { error: res.error };
    }

    case "get_stats": {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
      const [ordersToday, ordersThisMonth, pendingOrders, newBookings, activeProducts, lowStock, customers] =
        await Promise.all([
          prisma.order.count({ where: { createdAt: { gte: start } } }),
          prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
          prisma.order.count({ where: { status: "PENDING" } }),
          prisma.booking.count({ where: { status: "NEW" } }),
          prisma.product.count({ where: { isActive: true } }),
          prisma.product.findMany({ where: { isActive: true, stock: { lt: 5 } }, select: { name: true }, take: 5 }),
          prisma.customer.count(),
        ]);
      return {
        ordersToday,
        ordersThisMonth,
        pendingOrders,
        newBookings,
        activeProducts,
        lowStock: lowStock.map((p) => p.name),
        customers,
      };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}
