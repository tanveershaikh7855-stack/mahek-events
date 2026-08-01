"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, Calendar, UserRound } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Book", href: "/booking" },
  { icon: ShoppingBag, label: "Cart", href: "/cart" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  // Routes to the account page, which redirects signed-out visitors to /login —
  // so this single tab covers sign-in, sign-up and account for mobile users.
  { icon: UserRound, label: "Account", href: "/account" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-2xl border-t border-black/[0.04]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const badge =
            item.href === "/cart" ? itemCount :
            item.href === "/wishlist" ? wishlistItems.length :
            0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 relative transition-colors duration-200 min-w-[48px] min-h-[48px]",
                isActive ? "text-forest" : "text-secondary-text"
              )}
              aria-label={item.label}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.6} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[16px] h-[16px] bg-forest text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </div>
              {isActive && <span className="w-4 h-[2.5px] rounded-full bg-forest" />}
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
