"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, Shield, HeadphonesIcon, Sparkles, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { NAV_LINKS } from "@/lib/constants";

const materialNavLink = NAV_LINKS.find((l) => l.label === "Decorative Material");
const materialChildren = materialNavLink?.children || [];

function MegaMenu() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 bg-white border-b border-border/50 shadow-xl shadow-black/5 pt-6 pb-8 px-4 md:px-8"
    >
      <div className="container-tight">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {materialChildren.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-transparent hover:border-forest/20 hover:bg-forest-light/50 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-light flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                {child.icon}
              </div>
              <span className="text-[0.8125rem] font-medium text-ink group-hover:text-forest transition-colors">
                {child.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-center gap-6">
          <Link href="/materials" className="text-sm font-semibold text-forest hover:underline flex items-center gap-1.5">
            View All Materials <ChevronDown className="w-3.5 h-3.5" />
          </Link>
          <Link href="/booking" className="text-sm font-medium text-secondary-text hover:text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
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

  const navLinks = NAV_LINKS;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      )}
    >
      <div className="container-tight">
        <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0"
            aria-label="Mahek Decorator Home"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo/logo.png"
                alt="Mahek Decorator"
                width={180}
                height={48}
                className="h-[42px] md:h-[48px] w-auto object-contain"
                priority
              />
              <span className="font-poppins font-semibold text-lg text-ink hidden sm:block">
                Mahek Decorator
              </span>
              <span className="hidden">
                <span className="font-poppins text-[10px] text-secondary-text uppercase tracking-widest">
                  Premium Balloon &amp; Decoration Studio
                </span>
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
                      "px-3.5 py-2 rounded-xl text-[0.8125rem] font-medium transition-all duration-200 flex items-center gap-1.5",
                      isActive
                        ? "text-forest bg-forest-light"
                        : "text-secondary-text hover:text-ink hover:bg-secondary/80"
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

          <div className="hidden lg:flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-secondary-text hover:text-ink hover:bg-secondary/80"
              asChild
            >
              <Link href="/search" aria-label="Search">
                <Search className="w-[18px] h-[18px]" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-secondary-text hover:text-ink hover:bg-secondary/80 relative"
              asChild
            >
              <Link href="/wishlist" aria-label={`Wishlist (${wishlistItems.length})`}>
                <Heart className="w-[18px] h-[18px]" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-secondary-text hover:text-ink hover:bg-secondary/80 relative"
              asChild
            >
              <Link href="/cart" aria-label={`Cart (${itemCount})`}>
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-secondary-text hover:text-ink hover:bg-secondary/80"
              asChild
            >
              <Link href="/account" aria-label="My Account">
                <User className="w-[18px] h-[18px]" />
              </Link>
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button className="h-10 px-5 rounded-xl bg-forest text-white font-medium text-sm hover:bg-forest/90 transition-all duration-200 hover:shadow-md hover:shadow-forest/20 flex items-center gap-2" asChild>
              <Link href="/booking">
                Book Decoration
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl relative"
              asChild
            >
              <Link href="/cart" aria-label={`Cart (${itemCount})`}>
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
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
            className="border-t border-border/50 bg-white/95 backdrop-blur-xl px-4 pb-4 md:hidden overflow-hidden"
          >
            <form action="/search" className="relative pt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
              <input
                type="search"
                name="q"
                placeholder="Search materials, products, decor..."
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-ink placeholder-secondary-text focus:outline-none focus:border-forest focus:bg-white transition-colors"
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
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/logo/logo.png"
                    alt="Mahek Decorator"
                    width={120}
                    height={34}
                    className="h-[34px] w-auto object-contain"
                  />
                  <span className="font-poppins font-semibold text-base text-ink">Mahek Decorator</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
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
                          <summary className="flex items-center justify-between px-4 py-3 rounded-xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-secondary cursor-pointer list-none transition-colors">
                            {link.label}
                            <ChevronDown className="w-4 h-4 text-secondary-text group-open:text-forest transition-transform duration-200" />
                          </summary>
                          <div className="ml-4 mt-1 space-y-0.5">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2.5 rounded-xl text-sm text-secondary-text hover:text-ink hover:bg-secondary transition-colors"
                              >
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
                            "block px-4 py-3 rounded-xl text-[0.9375rem] font-medium transition-colors",
                            pathname === link.href || pathname.startsWith(link.href + "/")
                              ? "bg-forest-light text-forest"
                              : "text-secondary-text hover:text-ink hover:bg-secondary"
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-border/50 space-y-1">
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-secondary"
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-secondary"
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
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9375rem] font-medium text-secondary-text hover:text-ink hover:bg-secondary"
                  >
                    <User className="w-5 h-5" />
                    My Account
                  </Link>

                  <Link
                    href="/booking"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 mt-3 px-4 py-3 rounded-xl text-[0.9375rem] font-semibold text-white bg-forest hover:bg-forest/90 transition-colors"
                  >
                    Book Decoration
                  </Link>
                </div>

                <div className="p-4 mt-4 border-t border-border/50 space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-secondary-text">
                    <div className="w-9 h-9 rounded-lg bg-forest-light flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">140 KM Delivery</p>
                      <p className="text-xs text-secondary-text">Same day available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-text">
                    <div className="w-9 h-9 rounded-lg bg-forest-light flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">Secure Payment</p>
                      <p className="text-xs text-secondary-text">COD, UPI, Cards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-text">
                    <div className="w-9 h-9 rounded-lg bg-forest-light flex items-center justify-center flex-shrink-0">
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
        <div className="hidden md:block fixed inset-0 z-30" onClick={() => setMaterialMenuOpen(false)} />
      )}
    </motion.header>
  );
}