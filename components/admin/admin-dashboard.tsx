"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarCheck,
  Package,
  Users,
  Tag,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  TrendingUp,
  IndianRupee,
  Truck,
  Clock,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice, formatDate } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders", count: 24 },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings", count: 12 },
  { icon: Package, label: "Products", href: "/admin/products", count: 120 },
  { icon: Users, label: "Customers", href: "/admin/customers", count: 3400 },
  { icon: Tag, label: "Coupons", href: "/admin/coupons" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const STATS = [
  { label: "Total Revenue", value: "₹12,45,000", change: "+12.5%", icon: IndianRupee, trend: "up" },
  { label: "Orders", value: "1,234", change: "+8.2%", icon: ShoppingBag, trend: "up" },
  { label: "Bookings", value: "456", change: "+15.3%", icon: CalendarCheck, trend: "up" },
  { label: "Products", value: "120", change: "0%", icon: Package, trend: "neutral" },
];

const RECENT_ORDERS = [
  { id: "MD-2607-A3B2", customer: "Priya Sharma", amount: 1299, status: "DELIVERED", date: "2026-07-26" },
  { id: "MD-2607-C4D1", customer: "Rahul Mehta", amount: 799, status: "SHIPPED", date: "2026-07-26" },
  { id: "MD-2607-E5F9", customer: "Ananya Patel", amount: 3499, status: "CONFIRMED", date: "2026-07-25" },
  { id: "MD-2507-A1B0", customer: "Vikram Joshi", amount: 2499, status: "PENDING", date: "2026-07-25" },
  { id: "MD-2507-G6H3", customer: "Neha Singh", amount: 599, status: "DELIVERED", date: "2026-07-24" },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
  CONFIRMED: "bg-forest-light text-forest border-forest/20",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-ink text-sm">Mahek Admin</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                item.active
                  ? "bg-forest-light text-forest"
                  : "text-secondary-text hover:text-ink hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {item.count}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-text hover:text-ink hover:bg-secondary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-ink">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl hover:bg-secondary transition-colors relative">
                <Bell className="w-5 h-5 text-secondary-text" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-forest" />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary">
                <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-ink">Admin</p>
                  <p className="text-xs text-secondary-text">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl border border-border bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-forest" />
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      stat.trend === "up" && "text-green-700 bg-green-50",
                      stat.trend === "neutral" && "text-gray-500 bg-gray-50"
                    )}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-ink mt-3">{stat.value}</p>
                <p className="text-sm text-secondary-text mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-ink">Recent Orders</h2>
                <Button variant="ghost" size="sm" className="text-sm">
                  View All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-medium text-secondary-text">Order</th>
                      <th className="text-left py-3 font-medium text-secondary-text">Customer</th>
                      <th className="text-left py-3 font-medium text-secondary-text">Amount</th>
                      <th className="text-left py-3 font-medium text-secondary-text">Status</th>
                      <th className="text-left py-3 font-medium text-secondary-text">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-b-0">
                        <td className="py-3 font-medium text-ink">{order.id}</td>
                        <td className="py-3 text-secondary-text">{order.customer}</td>
                        <td className="py-3 font-medium">{formatPrice(order.amount)}</td>
                        <td className="py-3">
                          <Badge variant="outline" className={cn("text-xs border", STATUS_COLORS[order.status])}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-secondary-text text-xs">{formatDate(order.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-2xl border border-border bg-white space-y-4">
              <h2 className="text-lg font-semibold text-ink">Quick Actions</h2>
              {[
                { icon: ShoppingBag, label: "New Order", desc: "Add order manually" },
                { icon: CalendarCheck, label: "Manage Bookings", desc: "Pending: 12" },
                { icon: Package, label: "Add Product", desc: "Update inventory" },
                { icon: Tag, label: "Create Coupon", desc: "New promotion" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-forest-light flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{action.label}</p>
                    <p className="text-xs text-secondary-text">{action.desc}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary-text -rotate-90" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}