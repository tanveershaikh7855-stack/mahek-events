"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Sparkles,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/shop/product-card";
import { QuickView } from "@/components/shop/quick-view";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/seed";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = FALLBACK_CATEGORIES.filter((c) => c.type === "PRODUCT");
const ALL_PRODUCTS = FALLBACK_PRODUCTS;
const PRODUCTS_PER_PAGE = 12;

type SortOption = "popular" | "price-low" | "price-high" | "newest" | "rating" | "name-az";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
];

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[18px] border border-black/[0.04] overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-secondary" />
      <div className="p-3.5 space-y-2.5">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-secondary rounded" />
          <div className="h-3 w-12 bg-secondary rounded" />
        </div>
        <div className="h-4 w-full bg-secondary rounded" />
        <div className="h-4 w-3/4 bg-secondary rounded" />
        <div className="h-5 w-24 bg-secondary rounded mt-2" />
      </div>
    </div>
  );
}

export function ShopPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading on mount and filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedCategory, sortBy, searchQuery]);

  const filtered = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
        break;
      case "price-high":
        result.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        break;
      default:
        result.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery]);

  const handleQuickView = useCallback((product: any) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-6 md:pt-28 md:pb-8 bg-background border-b border-black/[0.04]">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="heading-section text-ink">Shop</h1>
              <p className="text-sm text-secondary-text mt-1">
                {filtered.length} {filtered.length === 1 ? "product" : "products"} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                <Input
                  type="search"
                  placeholder="Search products, SKUs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-11 rounded-xl bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-secondary-text hover:text-ink transition-colors" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex h-11 w-11 rounded-xl"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className={cn(
            "flex flex-wrap gap-2 mt-5 transition-all duration-300",
            showFilters ? "max-h-96 opacity-100" : "max-h-20 md:max-h-none opacity-100"
          )}>
            <button
              onClick={() => handleCategorySelect(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                selectedCategory === null
                  ? "bg-forest text-white shadow-sm shadow-forest/20"
                  : "bg-secondary text-secondary-text hover:bg-border"
              )}
            >
              All ({ALL_PRODUCTS.length})
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const count = ALL_PRODUCTS.filter((p) => p.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    selectedCategory === cat.id
                      ? "bg-forest text-white shadow-sm shadow-forest/20"
                      : "bg-secondary text-secondary-text hover:bg-border"
                  )}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort + View Controls */}
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-secondary-text" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm bg-transparent border-none focus:outline-none text-secondary-text cursor-pointer font-medium"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 md:py-10">
        <div className="container-tight">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <Package className="w-10 h-10 text-border" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">No products found</h3>
              <p className="text-secondary-text mb-6 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="rounded-xl"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.03, duration: 0.4 }}
                    >
                      <ProductCard
                        product={product}
                        priority={index < 4}
                        onQuickView={handleQuickView}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "h-10 w-10 rounded-xl",
                        currentPage === page && "bg-forest text-white hover:bg-forest-hover"
                      )}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Page Info */}
              <div className="text-center mt-4 text-sm text-secondary-text">
                Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
                {Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length} products
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </div>
  );
}
