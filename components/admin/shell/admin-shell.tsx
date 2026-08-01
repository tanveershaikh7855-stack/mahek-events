"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarCheck,
  Package,
  Image as ImageIcon,
  Sparkles,
  Users,
  Tag,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type NavCounts = {
  orders: number;
  bookings: number;
  products: number;
  customers: number;
  reviews: number;
};

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", key: null },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders", key: "orders" },
  { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings", key: "bookings" },
  { icon: Package, label: "Products", href: "/admin/products", key: "products" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery", key: null },
  { icon: Sparkles, label: "Offers", href: "/admin/offers", key: null },
  { icon: Users, label: "Customers", href: "/admin/customers", key: "customers" },
  { icon: Tag, label: "Coupons", href: "/admin/coupons", key: null },
  { icon: Star, label: "Reviews", href: "/admin/reviews", key: "reviews" },
  { icon: Settings, label: "Settings", href: "/admin/settings", key: null },
] as const;

export function AdminShell({
  counts,
  user,
  title,
  children,
}: {
  counts: NavCounts;
  user: { name?: string | null; email?: string | null };
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initial = (user.name || user.email || "A").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-ink text-sm">Mahek Admin</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {NAV.map((item) => {
            const count = item.key ? counts[item.key] : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-forest-light text-forest"
                    : "text-secondary-text hover:text-ink hover:bg-secondary",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary-text hover:text-ink hover:bg-secondary transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>View Website</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setOpen(true)} className="lg:hidden p-2" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-ink">{title}</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary">
              <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white text-xs font-bold">
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-ink leading-tight">{user.name || "Admin"}</p>
                <p className="text-xs text-secondary-text leading-tight">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
