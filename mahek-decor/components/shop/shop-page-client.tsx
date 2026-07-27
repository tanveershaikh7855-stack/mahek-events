"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, List, X, ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shop/product-card";
import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/seed";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = FALLBACK_CATEGORIES.filter((c) => c.type === "PRODUCT");
const ALL_PRODUCTS = FALLBACK_PRODUCTS;

type SortOption = "popular" | "price-low" | "price-high" | "newest" | "rating";

export function ShopPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);

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
      case "newest":
        break;
      default:
        result.sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-8 md:pt-28 md:pb-12 bg-background border-b border-border">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="heading-section text-ink">Shop</h1>
              <p className="body-large mt-2">
                {filtered.length} {filtered.length === 1 ? "product" : "products"} available
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-secondary-text" />
                  </button>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="hidden md:flex"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                selectedCategory === null
                  ? "bg-forest text-white"
                  : "bg-secondary text-secondary-text hover:bg-border"
              )}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  selectedCategory === cat.id
                    ? "bg-forest text-white"
                    : "bg-secondary text-secondary-text hover:bg-border"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-secondary-text" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm bg-transparent border-none focus:outline-none text-secondary-text cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-tight">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-border mb-4" />
              <h3 className="text-xl font-semibold text-ink mb-2">No products found</h3>
              <p className="text-secondary-text mb-6">Try adjusting your search or filter criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <ProductCard product={product} priority={index < 4} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}