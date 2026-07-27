"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Truck, Star, Eye } from "lucide-react";
import { formatPrice, calculateDiscountPercent, cn } from "@/lib/utils";
import { FALLBACK_PRODUCTS } from "@/lib/seed";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { ArrowRight } from "@/components/ui/icons";

interface ProductCardProps {
  product: typeof FALLBACK_PRODUCTS[0];
  priority?: boolean;
}

const categoryNames: Record<string, string> = {
  "cat-1": "Helium Balloons",
  "cat-2": "Balloon Bouquets",
  "cat-3": "Balloon Packets",
  "cat-4": "Party Supplies",
  "cat-5": "Flower Bouquets",
};

function ProductCard({ product, priority }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlist();
  const { items } = useCart();
  const inCart = items.some((i) => i.productId === product.id);
  const discount = calculateDiscountPercent(product.basePrice, product.salePrice);
  const price = product.salePrice ?? product.basePrice;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="group relative bg-white rounded-2xl border border-border/40 overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Link href={`/shop/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover image-zoom"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-forest text-white text-[10px] font-bold tracking-wide">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist + Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
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
              "w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200",
              isInWishlist(product.id) ? "text-forest" : "text-secondary-text hover:text-forest"
            )}
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-3.5 h-3.5", isInWishlist(product.id) ? "fill-current" : "")} />
          </button>
          <Link
            href={`/shop/${product.slug}`}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 text-secondary-text hover:text-ink"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Delivery badge */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-medium text-forest">
            <Truck className="w-3 h-3" />
            {product.deliveryBadge}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-forest/70">
            {categoryNames[product.categoryId] || "Products"}
          </span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-[11px] font-semibold text-ink">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-secondary-text">({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="heading-card text-ink line-clamp-2 mb-1.5 group-hover:text-forest transition-colors duration-150">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-ink tracking-tight">{formatPrice(price)}</span>
          {product.salePrice && product.salePrice < product.basePrice && (
            <span className="text-secondary-text line-through text-xs">{formatPrice(product.basePrice)}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedProducts() {
  const featuredProducts = FALLBACK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-label mb-4 inline-flex"
            >
              Curated Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.04 }}
              className="heading-section text-ink"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.08 }}
              className="body-large mt-3 max-w-xl"
            >
              Hand-picked favorites loved by our customers. Premium quality, guaranteed fresh.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.12 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} priority={index < 4} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
