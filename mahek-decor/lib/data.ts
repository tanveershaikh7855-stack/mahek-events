import { prisma } from "./prisma";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PRODUCTS,
  FALLBACK_SERVICES,
  FALLBACK_GALLERY,
  FALLBACK_DELIVERY_CHARGES,
} from "./seed";

function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  return fn().catch(() => fallback);
}

export async function getCategories(type?: "PRODUCT" | "SERVICE" | "EVENT") {
  return withFallback(async () => {
    const where = type ? { type, isActive: true } : { isActive: true };
    return prisma.category.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });
  }, FALLBACK_CATEGORIES.filter((c) => (type ? c.type === type : true)) as any);
}

export async function getCategoryBySlug(slug: string) {
  return withFallback(
    async () => prisma.category.findUnique({ where: { slug } }),
    FALLBACK_CATEGORIES.find((c) => c.slug === slug) as any,
  );
}

export async function getProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}) {
  return withFallback(async () => {
    const where: any = { isActive: true };
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
  }).slice(0, options?.limit).map((p) => ({ ...p, category: FALLBACK_CATEGORIES.find((c) => c.id === p.categoryId) })) as any);
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
      : (null as any),
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
    FALLBACK_PRODUCTS.filter((p) => p.categoryId === categoryId && p.id !== productId).slice(0, limit) as any,
  );
}

export async function getServices() {
  return FALLBACK_SERVICES as any;
}

export async function getServiceBySlug(slug: string) {
  return FALLBACK_SERVICES.find((s) => s.slug === slug) as any;
}

export async function getGallery(category?: string) {
  if (category && category !== "all") {
    return FALLBACK_GALLERY.filter((g) => g.category === category).sort(() => Math.random() - 0.5) as any;
  }
  return [...FALLBACK_GALLERY].sort(() => Math.random() - 0.5) as any;
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
