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
  return withFallback(
    async () => {
      const where: Prisma.GalleryImageWhereInput = { isActive: true };
      if (category && category !== "all") where.category = category;
      const rows = await prisma.galleryImage.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
      // Before any image is added in admin the table is empty — fall back to the
      // static set rather than showing a blank gallery.
      if (rows.length === 0) {
        return category && category !== "all"
          ? shuffle(FALLBACK_GALLERY.filter((g) => g.category === category))
          : shuffle(FALLBACK_GALLERY);
      }
      return rows;
    },
    category && category !== "all"
      ? shuffle(FALLBACK_GALLERY.filter((g) => g.category === category))
      : shuffle(FALLBACK_GALLERY),
  );
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

// ── STOREFRONT SHAPING ────────────────────────────────────────
// The public product pages/components expect the plain `Product` shape from
// lib/content.ts (numbers, string[] images, {label,options}[] variants). Both
// the Prisma rows and the static fallback flow through getProducts(); this maps
// either form into that shape so a single set of components serves both.

import type { Product as StoreProduct } from "./content";

function toNum(v: unknown, fallback = 0): number {
  if (v === null || v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") {
    return v
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * next/image throws on a relative src that lacks a leading slash (e.g. a
 * hand-typed "IMG-1234"). Normalise stored image references so bad data shows a
 * broken/placeholder image instead of crashing the whole page render.
 */
function normalizeImageSrc(src: string): string | null {
  const s = src.trim();
  if (!s) return null;
  if (s.startsWith("data:") || s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;
  return `/${s}`;
}

/**
 * Image lists never split on commas — base64 data URLs contain one. Only a
 * newline separates entries.
 */
function toImageArray(v: unknown): string[] {
  const raw = Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string")
    : typeof v === "string"
      ? v.split("\n")
      : [];
  return raw
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizeImageSrc)
    .filter((s): s is string => Boolean(s));
}

type VariantGroup = { label: string; options: string[] };

function toVariants(v: unknown): VariantGroup[] {
  if (!Array.isArray(v)) return [];
  const out: VariantGroup[] = [];
  for (const g of v) {
    if (g && typeof g === "object" && "label" in g && "options" in g) {
      const label = String((g as { label: unknown }).label ?? "");
      const options = toStringArray((g as { options: unknown }).options);
      if (label && options.length) out.push({ label, options });
    }
  }
  return out;
}

/** Normalises a DB or fallback product row into the storefront Product shape. */
export function mapToStoreProduct(row: Record<string, unknown>): StoreProduct {
  const base = toNum(row.basePrice);
  const sale = row.salePrice === null || row.salePrice === undefined ? null : toNum(row.salePrice);
  const reviews = Array.isArray(row.reviews) ? (row.reviews as { rating: number }[]) : null;
  const rating =
    reviews && reviews.length
      ? reviews.reduce((s, r) => s + toNum(r.rating), 0) / reviews.length
      : toNum(row.rating);
  const reviewCount = reviews ? reviews.length : toNum(row.reviewCount);
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    shortDesc: (row.shortDesc as string) ?? "",
    description: (row.description as string) ?? "",
    basePrice: base,
    salePrice: sale && sale < base ? sale : sale,
    sku: (row.sku as string) ?? "",
    stock: toNum(row.stock),
    rating,
    reviewCount,
    isFeatured: Boolean(row.isFeatured),
    deliveryBadge: (row.deliveryBadge as string) ?? "Same Day",
    categoryId: String(row.categoryId ?? ""),
    images: toImageArray(row.images),
    tags: toStringArray(row.tags),
    variants: toVariants(row.variants),
  };
}

/** Product categories for the shop filter, DB-first with static fallback. */
export async function getStoreProductCategories() {
  const rows = await getCategories("PRODUCT");
  return rows.map((c) => ({
    id: String(c.id),
    name: String(c.name),
    slug: String(c.slug),
    type: "PRODUCT" as const,
  }));
}

/** All active products in storefront shape. */
export async function getStoreProducts(options?: {
  categorySlug?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
}): Promise<StoreProduct[]> {
  const rows = (await getProducts(options)) as unknown as Record<string, unknown>[];
  return rows.map(mapToStoreProduct);
}

/** A single product in storefront shape, or null. */
export async function getStoreProductBySlug(slug: string): Promise<StoreProduct | null> {
  const row = (await getProductBySlug(slug)) as unknown as Record<string, unknown> | null;
  if (!row) return null;
  return mapToStoreProduct(row);
}
