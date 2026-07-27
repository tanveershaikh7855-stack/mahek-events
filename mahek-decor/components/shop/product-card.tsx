"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc: string;
    basePrice: number;
    salePrice: number | null;
    sku: string;
    stock: number;
    rating: number;
    reviewCount: number;
    isFeatured: boolean;
    deliveryBadge: string;
    categoryId: string;
    images: string[];
  };
  priority?: boolean;
}

const categoryNames: Record<string, string> = {
  "cat-1": "Helium Balloons",
  "cat-2": "Balloon Bouquets",
  "cat-3": "Balloon Packets",
  "cat-4": "Party Supplies",
  "cat-5": "Flower Bouquets",
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { items: wishlistItems, toggleItem } = useWishlist();
  const { items: cartItems } = useCart();

  const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
  const discount = calculateDiscountPercent(product.basePrice, product.salePrice);
  const inCart = cartItems.some((item) => item.productId === product.id);
  const isInWishlist = wishlistItems.some((item) => item.productId === product.id);

  return (
    <article className="group relative bg-white rounded-2xl border border-border/60 overflow-hidden card-lift card-soft">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Link href={`/shop/${product.slug}`} className="block relative w-full h-full" aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="image-zoom object-cover"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
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
                isInWishlist ? "text-forest" : "text-secondary-text hover:text-forest"
              )}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("w-4 h-4", isInWishlist ? "fill-current" : "")} />
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all text-secondary-text hover:text-forest"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            className="flex-1 h-9 text-xs font-semibold rounded-xl bg-forest text-white hover:bg-forest/90"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={inCart}
            asChild={!inCart}
          >
            {inCart ? (
              <span className="flex items-center justify-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                In Cart
              </span>
            ) : (
              <Link href={`/shop/${product.slug}`} className="flex items-center justify-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Quick View
              </Link>
            )}
          </Button>
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
    </article>
  );
}
