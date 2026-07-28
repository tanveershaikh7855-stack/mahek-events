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
    <article className="group relative bg-white rounded-2xl border border-black/[0.04] overflow-hidden card-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
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
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-lg bg-forest text-white text-[10px] font-bold tracking-wide shadow-sm">
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
            "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-300",
            "md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0",
            isInWishlist ? "text-forest" : "text-secondary-text hover:text-forest"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-3.5 h-3.5", isInWishlist ? "fill-current" : "")} />
        </button>

        {/* Delivery badge */}
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
          <span className="text-[0.9375rem] font-bold text-ink tracking-tight">{formatPrice(price)}</span>
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
