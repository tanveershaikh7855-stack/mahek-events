"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Shield, HeadphonesIcon, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { NAV_LINKS } from "@/lib/constants";

const materialNavLink = NAV_LINKS.find((l) => l.label === "Decorative Material");
const materialChildren = materialNavLink?.children || [];

const ease = [0.16, 1, 0.3, 1];

function MegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2, ease }}
      className="absolute top-full left-0 right-0 bg-white border-b border-border/30 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)] pt-8 pb-10 px-6 md:px-10"
    >
      <div className="container-tight">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {materialChildren.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl hover:bg-forest/5 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-forest/5 flex items-center justify-center text-xl group-hover:bg-forest/10 group-hover:scale-105 transition-all duration-200">
                {child.icon}
              </div>
              <span className="text-[0.75rem] font-medium text-secondary-text group-hover:text-ink transition-colors leading-tight">
                {child.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-border/30 flex items-center justify-center gap-6">
          <Link href="/materials" className="text-sm font-semibold text-forest hover:underline underline-offset-4">
            View All Materials
          </Link>
          <Link href="/booking" className="text-sm font-medium text-secondary-text hover:text-ink transition-colors">
            Book a Setup
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [materialMenuOpen, setMaterialMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setMaterialMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [mobileMenuOpen]);

  const navLinks = NAV_LINKS;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/90 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_1px_0_rgba(0,0,0,0.03)]"
          : "bg-white/60 backdrop-blur-xl"
      )}
    >
      <div className="container-tight">
          <div className="flex items-center justify-between h-14 md:h-[60px] gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0"
            aria-label="Mahek Balloon Home"
          >
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo/logo.png"
                alt="Mahek Balloon"
                width={160}
                height={44}
                className="h-[36px] md:h-[40px] w-auto object-contain"
                priority
              />
              <span className="font-heading font-bold text-[0.9375rem] text-ink hidden sm:block tracking-tight">
                Mahek Balloon
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map((link) => {
              const hasChildren = link.children && link.children.length > 0;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <div key={link.href} className="relative" onMouseEnter={() => hasChildren && setMaterialMenuOpen(true)} onMouseLeave={() => hasChildren && setMaterialMenuOpen(false)}>
                  <Link
                    href={link.href}
                    onClick={() => hasChildren && materialMenuOpen ? setMaterialMenuOpen(!materialMenuOpen) : undefined}
                    className={cn(
                      "px-3.5 py-2 rounded-full text-[0.8125rem] font-medium transition-all duration-200 flex items-center gap-1",
                      isActive
                        ? "text-forest bg-forest/8"
                        : "text-secondary-text hover:text-ink hover:bg-black/[0.03]"
                    )}
                  >
                    {link.label}
                    {hasChildren && (
                      <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", materialMenuOpen ? "rotate-180" : "")} />
                    )}
                  </Link>
                  {hasChildren && materialMenuOpen && <MegaMenu />}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-secondary-text hover:text-ink hover:bg-black/[0.03]"
              asChild
            >
              <Link href="/search" aria-label="Search">
                <Search className="w-[18px] h-[18px]" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-secondary-text hover:text-ink hover:bg-black/[0.03] relative"
              asChild
            >
              <Link href="/wishlist" aria-label={`Wishlist (${wishlistItems.length})`}>
                <Heart className="w-[18px] h-[18px]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-secondary-text hover:text-ink hover:bg-black/[0.03] relative"
              asChild
            >
              <Link href="/cart" aria-label={`Cart (${itemCount})`}>
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <div className="w-px h-5 bg-black/[0.06] mx-2" />

            <Button className="h-9 px-5 rounded-full bg-forest text-white font-semibold text-[0.8125rem] hover:bg-forest-hover transition-all duration-300 hover:shadow-lg hover:shadow-forest/20" asChild>
              <Link href="/booking">
                Book Decoration
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full relative"
              asChild
            >
              <Link href="/cart" aria-label={`Cart (${itemCount})`}>
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/30 bg-white/95 backdrop-blur-2xl px-5 pb-4 lg:hidden overflow-hidden"
          >
            <form action="/search" className="relative pt-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-secondary-text" />
              <input
                type="search"
                name="q"
                placeholder="Search materials, products, decor..."
                className="w-full pl-11 pr-4 py-3 bg-secondary/60 border border-border/40 rounded-2xl text-sm text-ink placeholder:text-secondary-text focus:outline-none focus:border-forest/30 focus:bg-white transition-all duration-200"
                autoFocus
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-white shadow-[-8px_0_40px_-12px_rgba(0,0,0,0.12)] lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border/30">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Mahek Balloon"
                    width={100}
                    height={30}
                    className="h-[30px] w-auto object-contain"
                  />
                  <span className="font-heading font-bold text-base text-ink tracking-tight">Mahek Balloon</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-0.5" aria-label="Mobile navigation">
                {navLinks.map((link) => {
                  const hasChildren = link.children && link.children.length > 0;
                  return (
                    <div key={link.href}>
                      {hasChildren ? (
                        <details className="group">
                          <summary className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-black/[0.03] cursor-pointer list-none transition-colors">
                            {link.label}
                            <ChevronDown className="w-4 h-4 text-secondary-text group-open:text-forest transition-transform duration-200" />
                          </summary>
                          <div className="ml-3 mt-1 space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-secondary-text hover:text-ink hover:bg-black/[0.03] transition-colors"
                              >
                                <span className="text-base">{child.icon}</span>
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "block px-4 py-3.5 rounded-2xl text-[0.9375rem] font-medium transition-colors",
                            pathname === link.href || pathname.startsWith(link.href + "/")
                              ? "bg-forest/8 text-forest"
                              : "text-secondary-text hover:text-ink hover:bg-black/[0.03]"
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-border/30 space-y-1">
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-black/[0.03]"
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist
                    {wishlistItems.length > 0 && (
                      <span className="ml-auto min-w-[20px] h-5 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-black/[0.03]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Cart
                    {itemCount > 0 && (
                      <span className="ml-auto min-w-[20px] h-5 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {itemCount > 9 ? "9+" : itemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mt-3 px-4 py-3.5 rounded-2xl text-[0.9375rem] font-semibold text-white bg-forest hover:bg-forest-hover transition-all duration-200"
                  >
                    Book Decoration
                  </Link>
                </div>

                <div className="p-4 mt-4 border-t border-border/30 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-forest/5 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">140 KM Delivery</p>
                      <p className="text-xs text-secondary-text">Same day available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-forest/5 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">Secure Payment</p>
                      <p className="text-xs text-secondary-text">COD, UPI, Cards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-forest/5 flex items-center justify-center flex-shrink-0">
                      <HeadphonesIcon className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">Support</p>
                      <p className="text-xs text-secondary-text">Mon-Sat 9AM-8PM</p>
                    </div>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {materialMenuOpen && (
        <div className="hidden lg:block fixed inset-0 z-30" onClick={() => setMaterialMenuOpen(false)} />
      )}
    </header>
  );
}
