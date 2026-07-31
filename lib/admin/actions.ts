"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

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

// ── ORDERS ────────────────────────────────────────────────────

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

const PAYMENT_STATUSES = ["PENDING", "PARTIALLY_PAID", "PAID", "FAILED", "REFUNDED"] as const;

export async function updateOrderStatus(id: string, status: string): Promise<Result> {
  await requireAdmin();
  const parsed = z.enum(ORDER_STATUSES).safeParse(status);
  if (!parsed.success) return fail("Invalid status");
  try {
    await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data,
        confirmedAt: parsed.data === "CONFIRMED" ? new Date() : undefined,
      },
    });
    revalidateAdmin("/admin/orders");
    return ok("Order updated");
  } catch (e) {
    console.error("[updateOrderStatus]", e);
    return fail("Could not update the order");
  }
}

export async function updateOrderPayment(id: string, paymentStatus: string): Promise<Result> {
  await requireAdmin();
  const parsed = z.enum(PAYMENT_STATUSES).safeParse(paymentStatus);
  if (!parsed.success) return fail("Invalid payment status");
  try {
    await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: parsed.data,
        paidAt: parsed.data === "PAID" ? new Date() : undefined,
      },
    });
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
    await prisma.booking.update({
      where: { id },
      data: {
        status: parsed.data,
        confirmedAt: parsed.data === "CONFIRMED" ? new Date() : undefined,
      },
    });
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

function parseImages(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]/)
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
    revalidateAdmin("/admin/products", "/shop");
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
    revalidateAdmin("/admin/products", "/shop");
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
    revalidateAdmin("/admin/products", "/shop");
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
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function saveCategory(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the category fields");
  const d = parsed.data;
  const data = {
    name: d.name,
    type: d.type,
    description: d.description || null,
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
    revalidateAdmin("/admin/products", "/shop");
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
    revalidateAdmin("/admin/products", "/shop");
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

// ── GALLERY ───────────────────────────────────────────────────

const gallerySchema = z.object({
  title: z.string().max(200).optional(),
  image: z.string().min(1, "Add an image"),
  category: z.string().trim().min(1, "Choose a category").default("all"),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function saveGalleryImage(id: string | null, formData: FormData): Promise<Result> {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  // The uploader stores newline-joined values; a gallery slot holds one image.
  if (typeof raw.image === "string") raw.image = raw.image.split("\n")[0]?.trim() ?? "";
  const parsed = gallerySchema.safeParse(raw);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the gallery fields");
  const d = parsed.data;
  const data = {
    title: d.title || null,
    image: d.image,
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
    revalidateAdmin("/admin/gallery", "/gallery");
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
    revalidateAdmin("/admin/gallery", "/gallery");
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
    revalidateAdmin("/admin/gallery", "/gallery");
    return ok(isActive ? "Image shown" : "Image hidden");
  } catch (e) {
    console.error("[toggleGalleryActive]", e);
    return fail("Could not update the image");
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
