"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shop/product-card";
import { FALLBACK_PRODUCTS } from "@/lib/seed";
import type { Product } from "@/lib/content";

export function SearchPageClient({ products }: { products?: Product[] }) {
  const ALL = products && products.length ? products : FALLBACK_PRODUCTS;
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    return ALL.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    );
  }, [q, ALL]);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-8 bg-background border-b border-border">
        <div className="container-tight">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary-text" />
            <Input
              type="search"
              placeholder="Search balloons, bouquets, decorations..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-14 h-14 text-lg rounded-2xl"
              autoFocus
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-tight">
          {q && (
            <p className="text-secondary-text mb-6">
              {results.length} result{results.length !== 1 && "s"} for &ldquo;{q}&rdquo;
            </p>
          )}
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product as any} priority={i < 4} />
                </motion.div>
              ))}
            </div>
          ) : q ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-border mb-4" />
              <h3 className="text-xl font-semibold text-ink mb-2">No products found</h3>
              <p className="text-secondary-text">Try different keywords or browse categories.</p>
            </div>
          ) : (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto text-border mb-4" />
              <p className="text-secondary-text">Type above to search our catalog of premium balloons and decorations.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}