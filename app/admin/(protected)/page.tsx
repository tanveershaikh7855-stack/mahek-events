import type { Metadata } from "next";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingBag,
  CalendarCheck,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentOrders,
  getRecentBookings,
} from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { StatusPill } from "@/components/admin/shared/ui";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mahek Balloons",
  robots: "noindex",
};

// Admin data must always be live, never statically cached.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [stats, orders, bookings] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(6),
    getRecentBookings(6),
  ]);

  const cards = [
    {
      label: "Revenue Collected",
      value: formatPrice(stats.revenue),
      sub: `${formatPrice(stats.revenueThisMonth)} this month`,
      icon: IndianRupee,
    },
    {
      label: "Orders",
      value: String(stats.orders),
      sub: `${stats.pendingOrders} pending`,
      icon: ShoppingBag,
      href: "/admin/orders",
    },
    {
      label: "Bookings",
      value: String(stats.bookings),
      sub: `${stats.newBookings} new`,
      icon: CalendarCheck,
      href: "/admin/bookings",
    },
    {
      label: "Customers",
      value: String(stats.customers),
      sub: "total registered",
      icon: Users,
      href: "/admin/customers",
    },
    {
      label: "Active Products",
      value: String(stats.products),
      sub: `${stats.lowStock} low on stock`,
      icon: Package,
      href: "/admin/products",
    },
  ];

  return (
    <PageShell title="Dashboard">
      <div className="space-y-6">
        {stats.lowStock > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              {stats.lowStock} product{stats.lowStock > 1 ? "s are" : " is"} low on stock (5 or
              fewer).{" "}
              <Link href="/admin/products" className="font-semibold underline">
                Review inventory
              </Link>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((c) => {
            const Inner = (
              <div className="p-5 rounded-2xl border border-border bg-white h-full hover:border-forest/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-forest" />
                </div>
                <p className="text-2xl font-bold text-ink mt-3 tabular-nums">{c.value}</p>
                <p className="text-sm text-secondary-text mt-0.5">{c.label}</p>
                <p className="text-xs text-secondary-text/70 mt-1">{c.sub}</p>
              </div>
            );
            return c.href ? (
              <Link key={c.label} href={c.href}>
                {Inner}
              </Link>
            ) : (
              <div key={c.label}>{Inner}</div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent orders */}
          <div className="p-5 rounded-2xl border border-border bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-xs font-medium text-forest inline-flex items-center gap-1 hover:underline"
              >
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-secondary-text py-8 text-center">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {o.customerName || "Guest"}
                      </p>
                      <p className="text-xs text-secondary-text">{o.orderNumber}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-ink tabular-nums">
                        {formatPrice(Number(o.total))}
                      </p>
                      <StatusPill status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent bookings */}
          <div className="p-5 rounded-2xl border border-border bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">Recent Bookings</h2>
              <Link
                href="/admin/bookings"
                className="text-xs font-medium text-forest inline-flex items-center gap-1 hover:underline"
              >
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm text-secondary-text py-8 text-center">No bookings yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {b.customerName || "Guest"}
                      </p>
                      <p className="text-xs text-secondary-text">
                        {b.eventType}
                        {b.eventDate ? ` · ${formatDate(b.eventDate)}` : ""}
                      </p>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
