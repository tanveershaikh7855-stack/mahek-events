"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Truck, Star } from "lucide-react";
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
    <article className="group relative bg-white rounded-2xl border border-border/40 overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
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

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-forest text-white text-[10px] font-bold tracking-wide">
              -{discount}%
            </span>
          )}
        </div>

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
              isInWishlist ? "text-forest" : "text-secondary-text hover:text-forest"
            )}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-3.5 h-3.5", isInWishlist ? "fill-current" : "")} />
          </button>
          <Link
            href={`/shop/${product.slug}`}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 text-secondary-text hover:text-ink"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>

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
    </article>
  );
}
