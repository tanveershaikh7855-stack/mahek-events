"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export function WishlistPageClient() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 md:pt-24">
        <section className="container-tight py-16 md:py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Heart className="w-20 h-20 mx-auto text-border mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4">Your Wishlist is Empty</h1>
            <p className="text-secondary-text mb-8 max-w-md mx-auto">
              Save your favorite items here and come back to them anytime.
            </p>
            <Button size="lg" className="bg-forest text-white hover:bg-forest/90" asChild>
              <Link href="/shop">Explore Products <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-8 bg-background border-b border-border">
        <div className="container-tight">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-ink">Wishlist</h1>
              <p className="text-secondary-text">{items.length} {items.length === 1 ? "item" : "items"}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearWishlist} className="text-secondary-text hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-tight">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group bg-white rounded-2xl border border-border overflow-hidden card-soft"
              >
                <Link href={`/shop/${item.slug}`} className="relative aspect-square overflow-hidden bg-secondary block">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover image-zoom"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </Link>
                <div className="p-4">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="font-semibold text-ink mb-1 line-clamp-1">{item.name}</h3>
                  </Link>
                  <p className="text-lg font-semibold text-forest mb-3">{formatPrice(item.price)}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-forest text-white hover:bg-forest/90"
                      onClick={() => addItem({ ...item, productId: item.productId })}
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.productId)}
                      className="text-secondary-text hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}