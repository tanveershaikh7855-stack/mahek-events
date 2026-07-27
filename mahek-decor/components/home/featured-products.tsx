"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Eye, Truck, Star } from "lucide-react";
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
      whileHover={{ y: -6 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="group relative bg-white rounded-2xl border border-border/60 overflow-hidden card-lift card-soft"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
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

        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {discount > 0 && (
            <Badge className="bg-forest text-white text-[11px] font-semibold px-2 py-0.5 rounded-lg" variant="default">
              -{discount}%
            </Badge>
          )}
          <div className="flex flex-col gap-1.5 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
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
                "w-9 h-9 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all",
                isInWishlist(product.id) ? "text-forest" : "text-secondary-text hover:text-forest"
              )}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("w-4 h-4", isInWishlist(product.id) ? "fill-current" : "")} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="secondary" className="label !text-[10px] !px-2 !py-0.5">
            {categoryNames[product.categoryId] || "Products"}
          </Badge>
          <div className="flex items-center gap-1 text-gold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-semibold text-ink">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-secondary-text">({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="heading-card text-ink line-clamp-2 mb-1.5 group-hover:text-forest transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="body-small line-clamp-1 mb-3 text-[13px]">{product.shortDesc}</p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-ink tracking-tight">{formatPrice(price)}</span>
          {product.salePrice && product.salePrice < product.basePrice && (
            <span className="text-secondary-text line-through text-xs">{formatPrice(product.basePrice)}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <Badge variant="outline" className="gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md border-forest/20 text-forest">
            <Truck className="w-3 h-3" />
            {product.deliveryBadge}
          </Badge>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="text-[10px] font-medium text-amber-600">Only {product.stock} left</span>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.05 }}
              className="heading-section text-ink"
            >
              Featured Products
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="body-large mt-3 max-w-xl"
            >
              Hand-picked favorites loved by our customers. Premium quality, guaranteed fresh.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop" className="flex items-center gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={product} priority={index < 4} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
