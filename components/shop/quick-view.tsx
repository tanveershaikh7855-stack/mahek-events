"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Star, Truck, Minus, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";

interface QuickViewProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc: string;
    description: string;
    basePrice: number;
    salePrice: number | null;
    sku: string;
    stock: number;
    rating: number;
    reviewCount: number;
    deliveryBadge: string;
    categoryId: string;
    images: string[];
    variants: Array<{ label: string; options: string[] }>;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function QuickView({ product, open, onOpenChange }: QuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const { toggleItem, isInWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!product) return null;

  const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
  const discount = calculateDiscountPercent(product.basePrice, product.salePrice);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: product.images[0],
      variant: Object.values(selectedVariants).join(" - "),
    });
    onOpenChange(false);
  };

  const handleWishlistToggle = () => {
    toggleItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: product.images[0],
      addedAt: Date.now(),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-ink" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
              {/* Image Gallery */}
              <div className="relative bg-surface">
                <div className="relative aspect-square">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-xl bg-forest text-white text-sm font-bold shadow-sm">
                        -{discount}% OFF
                      </span>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={cn(
                          "relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                          selectedImage === i ? "border-forest" : "border-white/50 hover:border-white"
                        )}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-2">
                  {categoryNames[product.categoryId] || "Products"}
                </span>

                <h2 className="text-xl font-bold text-ink mb-2">{product.name}</h2>
                <p className="text-sm text-secondary-text mb-4 line-clamp-2">{product.shortDesc}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-4 h-4", i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-border")}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-secondary-text">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold text-ink">{formatPrice(price)}</span>
                  {product.salePrice && product.salePrice < product.basePrice && (
                    <span className="text-sm text-secondary-text line-through">{formatPrice(product.basePrice)}</span>
                  )}
                </div>

                {/* Delivery */}
                <div className="flex items-center gap-2 mb-4 text-sm text-secondary-text">
                  <Truck className="w-4 h-4 text-forest" />
                  {product.deliveryBadge} Delivery
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    {product.variants.map((variant) => (
                      <div key={variant.label} className="mb-3">
                        <p className="text-sm font-medium text-ink mb-2">
                          {variant.label}: <span className="text-forest">{selectedVariants[variant.label] || "Select"}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {variant.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: option }))}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                selectedVariants[variant.label] === option
                                  ? "border-forest bg-forest-light text-forest"
                                  : "border-border bg-white text-secondary-text hover:border-ink/30"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity + Actions */}
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center text-secondary-text hover:text-ink hover:bg-secondary/50 transition-colors disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 h-10 flex items-center justify-center font-semibold text-ink text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 flex items-center justify-center text-secondary-text hover:text-ink hover:bg-secondary/50 transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-secondary-text">
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1 gap-2 bg-forest text-white hover:bg-forest-hover h-11 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-forest/20 disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleWishlistToggle}
                      className={cn(
                        "w-11 h-11 rounded-xl transition-all",
                        inWishlist && "bg-rose-50 border-rose-200 text-rose-500"
                      )}
                    >
                      <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
                    </Button>
                  </div>

                  <Link
                    href={`/shop/${product.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-forest hover:text-forest-hover transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
