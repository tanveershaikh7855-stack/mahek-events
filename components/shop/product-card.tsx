"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Truck, Star, Eye, Package } from "lucide-react";
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
  onQuickView?: (product: ProductCardProps["product"]) => void;
}

const categoryNames: Record<string, string> = {
  "cat-1": "Helium Balloons",
  "cat-2": "Balloon Bouquets",
  "cat-3": "Balloon Packets",
  "cat-4": "Party Supplies",
  "cat-5": "Flower Bouquets",
  "cat-6": "Chrome Balloons",
  "cat-7": "Foil Balloons",
  "cat-8": "Shape Balloons",
  "cat-9": "Number Balloons",
};

function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: "Out of Stock", color: "bg-gray-400" };
  if (stock <= 10) return { label: "Low Stock", color: "bg-amber-500" };
  return { label: "In Stock", color: "bg-emerald-500" };
}

export function ProductCard({ product, priority = false, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { items: wishlistItems, toggleItem } = useWishlist();
  const { addItem } = useCart();

  const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
  const discount = calculateDiscountPercent(product.basePrice, product.salePrice);
  const inWishlist = wishlistItems.some((item) => item.productId === product.id);
  const stockStatus = getStockStatus(product.stock);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: product.images[0],
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
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
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <article
      className={cn(
        "group relative bg-white rounded-[18px] border border-black/[0.04] overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1.5",
        product.stock === 0 && "opacity-70"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Link href={`/shop/${product.slug}`} className="block relative w-full h-full" aria-label={product.name}>
          <Image
            src={product.images[0] ?? "/images/IMG-20260728-WA0032.webp"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-500 ease-out",
              isHovered ? "scale-105" : "scale-100"
            )}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            unoptimized={(product.images[0] ?? "").startsWith("data:")}
          />
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-1 rounded-lg bg-forest text-white text-[10px] font-bold tracking-wide shadow-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={cn(
            "px-2 py-1 rounded-lg text-[10px] font-bold tracking-wide shadow-sm text-white",
            stockStatus.color
          )}>
            {stockStatus.label}
          </span>
        </div>

        {/* Quick Actions - Always visible on mobile, hover on desktop */}
        <div className={cn(
          "absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-2",
          "md:opacity-0 md:translate-y-2 md:transition-all md:duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0"
        )}>
          <button
            onClick={handleQuickView}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-sm text-ink text-xs font-semibold shadow-sm hover:bg-white transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-forest text-white text-xs font-semibold shadow-sm hover:bg-forest-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Cart
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-2.5 left-2.5 w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-300",
            discount > 0 && "top-11",
            "md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0",
            inWishlist ? "text-rose-500" : "text-secondary-text hover:text-rose-500"
          )}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-3.5">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest/60 truncate">
            {categoryNames[product.categoryId] || "Products"}
          </span>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span className="text-[11px] font-semibold text-ink">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-secondary-text">({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold text-ink line-clamp-2 leading-snug group-hover:text-forest transition-colors duration-200 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-[0.9375rem] font-bold text-ink tracking-tight tabular-nums">{formatPrice(price)}</span>
          {product.salePrice && product.salePrice < product.basePrice && (
            <span className="text-secondary-text line-through text-[11px]">{formatPrice(product.basePrice)}</span>
          )}
        </div>

        {/* Delivery Info - Desktop only */}
        <div className="hidden md:flex items-center gap-1 mt-2">
          <Truck className="w-3 h-3 text-forest" />
          <span className="text-[10px] text-secondary-text">{product.deliveryBadge} Delivery</span>
        </div>
      </div>
    </article>
  );
}
