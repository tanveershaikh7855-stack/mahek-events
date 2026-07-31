import "server-only";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * Admin read layer. Every export calls requireAdmin() so a query cannot run
 * for an unauthenticated caller even if a page forgets to guard itself.
 *
 * Unlike lib/data.ts (the storefront layer, which falls back to static content
 * during a DB outage) these deliberately throw on failure — an admin must never
 * be shown stale demo numbers and act on them.
 */

export type DashboardStats = {
  revenue: number;
  revenueThisMonth: number;
  orders: number;
  pendingOrders: number;
  bookings: number;
  newBookings: number;
  customers: number;
  products: number;
  lowStock: number;
};

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const [
    paidAgg,
    monthAgg,
    orders,
    pendingOrders,
    bookings,
    newBookings,
    customers,
    products,
    lowStock,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { amountPaid: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.aggregate({
      _sum: { amountPaid: true },
      where: { status: { not: "CANCELLED" }, createdAt: { gte: startOfMonth() } },
    }),
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.customer.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
  ]);

  return {
    revenue: Number(paidAgg._sum.amountPaid ?? 0),
    revenueThisMonth: Number(monthAgg._sum.amountPaid ?? 0),
    orders,
    pendingOrders,
    bookings,
    newBookings,
    customers,
    products,
    lowStock,
  };
}

/** Small counts used to badge the sidebar nav. */
export async function getNavCounts() {
  await requireAdmin();
  const [orders, bookings, products, customers, reviews] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "NEW" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.customer.count(),
    prisma.review.count({ where: { isVerified: false } }),
  ]);
  return { orders, bookings, products, customers, reviews };
}

export async function getRecentOrders(limit = 6) {
  await requireAdmin();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      customerPhone: true,
      total: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
  });
}

export async function getRecentBookings(limit = 6) {
  await requireAdmin();
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      bookingNumber: true,
      customerName: true,
      customerPhone: true,
      eventType: true,
      eventDate: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function getOrders() {
  await requireAdmin();
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      items: { select: { id: true, name: true, quantity: true, price: true } },
    },
  });
}

export async function getBookings() {
  await requireAdmin();
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function getCustomers() {
  await requireAdmin();
  return prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      _count: { select: { orders: true, bookings: true } },
    },
  });
}

export async function getAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { id: true, name: true } } },
  });
}

export async function getAdminCategories() {
  await requireAdmin();
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCoupons() {
  await requireAdmin();
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminGallery() {
  await requireAdmin();
  return prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getReviews() {
  await requireAdmin();
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      product: { select: { name: true, slug: true } },
      customer: { select: { name: true } },
    },
  });
}

export async function getSettings() {
  await requireAdmin();
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}
