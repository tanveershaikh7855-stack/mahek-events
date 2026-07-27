"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Truck, Star } from "lucide-react";
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
    <article className="group relative bg-white rounded-[18px] border border-border/40 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Link href={`/shop/${product.slug}`} className="block relative w-full h-full" aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="image-zoom object-cover"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        </Link>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="px-1.5 py-0.5 rounded-md bg-forest text-white text-[9px] font-bold tracking-wide">
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist button - always visible on mobile */}
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
            "absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200",
            "md:opacity-0 md:group-hover:opacity-100",
            isInWishlist ? "text-forest" : "text-secondary-text hover:text-forest"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-3 h-3", isInWishlist ? "fill-current" : "")} />
        </button>

        {/* Delivery badge */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-[9px] font-medium text-forest">
            <Truck className="w-2.5 h-2.5" />
            {product.deliveryBadge}
          </span>
        </div>
      </div>

      <div className="p-2.5 sm:p-3">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-forest/70 truncate">
            {categoryNames[product.categoryId] || "Products"}
          </span>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="w-2.5 h-2.5 text-gold fill-gold" />
            <span className="text-[10px] font-semibold text-ink">{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="heading-card text-ink line-clamp-2 group-hover:text-forest transition-colors duration-150">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-sm font-bold text-ink tracking-tight">{formatPrice(price)}</span>
          {product.salePrice && product.salePrice < product.basePrice && (
            <span className="text-secondary-text line-through text-[10px]">{formatPrice(product.basePrice)}</span>
          )}
          {discount > 0 && (
            <span className="text-[9px] font-semibold text-forest">{discount}% off</span>
          )}
        </div>
      </div>
    </article>
  );
}
