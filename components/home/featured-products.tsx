"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Truck, Star } from "lucide-react";
import { formatPrice, calculateDiscountPercent, cn } from "@/lib/utils";
import { FALLBACK_PRODUCTS } from "@/lib/seed";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { ArrowRight } from "@/components/ui/icons";

interface ProductCardProps {
  product: typeof FALLBACK_PRODUCTS[0];
}

const categoryNames: Record<string, string> = {
  "cat-1": "Helium Balloons",
  "cat-2": "Balloon Bouquets",
  "cat-3": "Balloon Packets",
  "cat-4": "Party Supplies",
  "cat-5": "Flower Bouquets",
};

function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlist();
  const { items } = useCart();
  const inCart = items.some((i) => i.productId === product.id);
  const discount = calculateDiscountPercent(product.basePrice, product.salePrice);
  const price = product.salePrice ?? product.basePrice;

  return (
    <article className="group relative bg-white rounded-2xl border border-black/[0.04] overflow-hidden card-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Link href={`/shop/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
          <Image
            src={product.images[0] ?? "/images/IMG-20260728-WA0032.webp"}
            alt={product.name}
            fill
            className="object-cover image-zoom"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={(product.images[0] ?? "").startsWith("data:")}
          />
        </Link>

        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-lg bg-forest text-white text-[10px] font-bold tracking-wide shadow-sm">
              -{discount}%
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price,
              image: product.images[0],
              addedAt: Date.now(),
            });
          }}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-300",
            "md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0",
            isInWishlist(product.id) ? "text-forest" : "text-secondary-text hover:text-forest"
          )}
          aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-3.5 h-3.5", isInWishlist(product.id) ? "fill-current" : "")} />
        </button>

        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-medium text-forest shadow-sm">
            <Truck className="w-3 h-3" />
            {product.deliveryBadge}
          </span>
        </div>
      </div>

      <div className="p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 truncate">
            {categoryNames[product.categoryId] || "Products"}
          </span>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-[11px] font-semibold text-ink">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="heading-card text-ink line-clamp-2 group-hover:text-forest transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[0.9375rem] font-bold text-ink tracking-tight tabular-nums">{formatPrice(price)}</span>
          {product.salePrice && product.salePrice < product.basePrice && (
            <span className="text-secondary-text line-through text-[11px]">{formatPrice(product.basePrice)}</span>
          )}
          {discount > 0 && (
            <span className="text-[10px] font-bold text-forest">{discount}% off</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function FeaturedProducts({
  products,
}: {
  products?: typeof FALLBACK_PRODUCTS;
}) {
  const source = products && products.length ? products : FALLBACK_PRODUCTS;
  const featuredProducts = source.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="section-label mb-3 inline-flex"
            >
              Curated Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.03 }}
              className="heading-section text-ink"
            >
              Featured Products
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08 }}
          >
            <Button variant="outline" size="sm" asChild>
              <Link href="/shop" className="flex items-center gap-1.5 text-xs">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
