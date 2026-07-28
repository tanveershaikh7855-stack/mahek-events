import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_SERVICES,
  FALLBACK_GALLERY,
  FALLBACK_DELIVERY_CHARGES,
} from "./seed";

/**
 * Falls back to the static content CMS when the database is unreachable, so the
 * storefront still renders during an outage or before the DB is seeded.
 *
 * The error is logged rather than silently swallowed — the previous version
 * discarded it entirely, which meant a misconfigured DATABASE_URL looked exactly
 * like a working site serving demo data, with nothing in the logs.
 *
 * The static content is shaped like the Prisma rows but not identical (plain
 * numbers instead of Decimal, no createdAt/updatedAt). Pages only read display
 * fields, so `fallback` is typed `unknown` and bridged with one documented cast
 * here instead of the ten scattered `as any` casts that sat at each call site.
 */
function withFallback<T>(fn: () => Promise<T>, fallback: unknown): Promise<T> {
  return fn().catch((error: unknown) => {
    console.error(
      "[data] database query failed, serving static fallback content:",
      error instanceof Error ? error.message : error,
    );
    return fallback as T;
  });
}

export async function getCategories(type?: "PRODUCT" | "SERVICE" | "EVENT") {
  return withFallback(async () => {
    const where = type ? { type, isActive: true } : { isActive: true };
    return prisma.category.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }, FALLBACK_CATEGORIES.filter((c) => (type ? c.type === type : true)));
}

export async function getCategoryBySlug(slug: string) {
  return withFallback(
    async () => prisma.category.findUnique({ where: { slug } }),
    FALLBACK_CATEGORIES.find((c) => c.slug === slug),
  );
}

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}) {
  return withFallback(async () => {
    const where: Prisma.ProductWhereInput = { isActive: true };
    if (options?.featured) where.isFeatured = true;
    if (options?.categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: options.categorySlug } });
      if (category) where.categoryId = category.id;
    }
    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { shortDesc: { contains: options.search, mode: "insensitive" } },
        { tags: { contains: options.search, mode: "insensitive" } },
      ];
    }
    return prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: options?.limit,
      include: { category: true, reviews: { select: { rating: true } } },
    });
  }, FALLBACK_PRODUCTS.filter((p) => {
    if (options?.featured && !p.isFeatured) return false;
    if (options?.categorySlug && p.categoryId !== FALLBACK_CATEGORIES.find((c) => c.slug === options.categorySlug)?.id) return false;
    if (options?.search && !p.name.toLowerCase().includes(options.search.toLowerCase())) return false;
    return true;
  }).slice(0, options?.limit).map((p) => ({ ...p, category: FALLBACK_CATEGORIES.find((c) => c.id === p.categoryId) })));
}

export async function getProductBySlug(slug: string) {
  return withFallback(
    async () =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: true, reviews: { include: { customer: { select: { name: true } } } } },
      }),
    FALLBACK_PRODUCTS.find((p) => p.slug === slug)
      ? {
          ...FALLBACK_PRODUCTS.find((p) => p.slug === slug),
          category: FALLBACK_CATEGORIES.find((c) => c.id === FALLBACK_PRODUCTS.find((p) => p.slug === slug)?.categoryId),
          reviews: [],
        }
      : (null),
  );
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  return withFallback(
    async () =>
      prisma.product.findMany({
        where: { isActive: true, categoryId, id: { not: productId } },
        take: limit,
        orderBy: { isFeatured: "desc" },
      }),
    FALLBACK_PRODUCTS.filter((p) => p.categoryId === categoryId && p.id !== productId).slice(0, limit),
  );
}

// Services and gallery are content-managed in lib/content.ts rather than the
// database, so these read straight from it — no cast needed.
export async function getServices() {
  return FALLBACK_SERVICES;
}

export async function getServiceBySlug(slug: string) {
  return FALLBACK_SERVICES.find((s) => s.slug === slug);
}

/** Fisher-Yates. `sort(() => Math.random() - 0.5)` is a biased shuffle. */
function shuffle<T>(input: readonly T[]): T[] {
  const items = [...input];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export async function getGallery(category?: string) {
  if (category && category !== "all") {
    return shuffle(FALLBACK_GALLERY.filter((g) => g.category === category));
  }
  return shuffle(FALLBACK_GALLERY);
}

export async function getDeliveryCharge(distanceKm: number, orderValue: number) {
  const charges = FALLBACK_DELIVERY_CHARGES;
  const slab = charges.find((c) => distanceKm >= c.minDistance && distanceKm <= c.maxDistance);
  if (!slab) return { charge: 499, freeAbove: Infinity };
  if (slab.freeAbove && orderValue >= Number(slab.freeAbove)) return { charge: 0, freeAbove: Number(slab.freeAbove) };
  return { charge: Number(slab.charge), freeAbove: Number(slab.freeAbove ?? 0) };
}

export async function getStats() {
  return withFallback(
    async () => {
      const [products, orders, bookings] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
        prisma.booking.count(),
      ]);
      return { products, orders, bookings, customers: 5000 };
    },
    { products: 120, orders: 3400, bookings: 890, customers: 5000 },
  );
}
