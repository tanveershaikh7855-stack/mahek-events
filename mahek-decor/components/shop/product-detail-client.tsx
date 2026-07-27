"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Shield,
  ArrowLeft,
  Star,
  Share2,
  ChevronRight,
  MessageCircle,
  CheckCircle,
  Clock,
  Package,
  Calendar,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shop/product-card";
import { cn, formatPrice, calculateDiscountPercent } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { FALLBACK_PRODUCTS } from "@/lib/seed";
import { BookingModal } from "@/components/booking/booking-modal";

interface ProductDetailClientProps {
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
    specifications?: Record<string, string>;
  };
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();

  const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
  const discount = calculateDiscountPercent(product.basePrice, product.salePrice);
  const inWishlist = isInWishlist(product.id);

  const relatedProducts = FALLBACK_PRODUCTS.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      image: product.images[0],
      variant: Object.values(selectedVariants).join(" - "),
    });
    setQuantity(1);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Breadcrumb */}
      <div className="container-tight py-4">
        <nav className="flex items-center gap-2 text-sm text-secondary-text" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="container-tight pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-forest text-white text-sm px-3 py-1">
                  -{discount}% OFF
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all",
                      selectedImage === i
                        ? "border-forest"
                        : "border-border hover:border-ink/30"
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Badge variant="secondary" className="w-fit mb-3">
              {product.categoryId === "cat-1" ? "Helium Balloons" : "Party Supplies"}
            </Badge>

            <h1 className="heading-section text-ink mb-3">{product.name}</h1>
            <p className="body-large text-secondary-text mb-6">{product.shortDesc}</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-5 h-5",
                      i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-border"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-secondary-text">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-ink">{formatPrice(price)}</span>
              {product.salePrice && product.salePrice < product.basePrice && (
                <>
                  <span className="text-lg text-secondary-text line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    Save {formatPrice(product.basePrice - product.salePrice)}
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-secondary-text">
                <Truck className="w-4 h-4 text-forest" />
                {product.deliveryBadge} Delivery
              </div>
              <div className="flex items-center gap-1.5 text-secondary-text">
                <Package className="w-4 h-4 text-forest" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </div>
              <div className="flex items-center gap-1.5 text-secondary-text">
                <CheckCircle className="w-4 h-4 text-forest" />
                Premium Quality
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Variants */}
            {product.variants &&
              product.variants.map((variant) => (
                <div key={variant.label} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-ink">
                      {variant.label}:{" "}
                      <span className="text-forest">
                        {selectedVariants[variant.label] || "Select"}
                      </span>
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setSelectedVariants((prev) => ({ ...prev, [variant.label]: option }))
                        }
                        className={cn(
                          "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
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

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 flex items-center justify-center text-secondary-text hover:text-ink disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-semibold text-ink">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-12 h-12 flex items-center justify-center text-secondary-text hover:text-ink disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                size="lg"
                className="flex-1 gap-2 bg-forest text-white hover:bg-forest/90 h-14 rounded-xl text-base"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart - {formatPrice(price * quantity)}
              </Button>
              <Button
                size="lg"
                className="flex-1 gap-2 h-14 rounded-xl text-base bg-white text-forest border-forest border hover:bg-forest-light"
                onClick={() => setBookingOpen(true)}
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 gap-2 h-14 rounded-xl text-base"
                asChild
              >
                <Link
                  href={`https://wa.me/919876543210?text=Hi! I'm interested in ${product.name} (${product.sku})`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Link>
              </Button>
            </div>

            <button
              onClick={() =>
                toggleItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price,
                  image: product.images[0],
                  addedAt: Date.now(),
                })
              }
              className="flex items-center justify-center gap-2 py-3 text-sm text-secondary-text hover:text-rose-500 transition-colors"
            >
              <Heart className={cn("w-5 h-5", inWishlist ? "fill-rose-500 text-rose-500" : "")} />
              {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>

            <Separator className="my-6" />

            {/* Delivery Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-forest mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ink">Same Day Delivery</p>
                  <p className="text-xs text-secondary-text">Order before 2 PM for same-day dispatch within 140 KM.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-forest mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ink">Secure Payment</p>
                  <p className="text-xs text-secondary-text">Pay via COD, UPI, or Credit/Debit Card.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-forest mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ink">Easy Returns</p>
                  <p className="text-xs text-secondary-text">Contact us within 24 hours for any issues.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-forest mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ink">Premium Quality</p>
                  <p className="text-xs text-secondary-text">Verified materials, decorator-grade balloons.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Reviews Tabs */}
      <section className="container-tight pb-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 gap-8">
            <TabsTrigger
              value="description"
              className="data-[state=active]:border-b-2 data-[state=active]:border-forest data-[state=active]:text-ink rounded-none bg-transparent px-0 py-4 text-secondary-text"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="data-[state=active]:border-b-2 data-[state=active]:border-forest data-[state=active]:text-ink rounded-none bg-transparent px-0 py-4 text-secondary-text"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:border-b-2 data-[state=active]:border-forest data-[state=active]:text-ink rounded-none bg-transparent px-0 py-4 text-secondary-text"
            >
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="max-w-3xl prose prose-neutral prose-sm">
              <p className="text-secondary-text leading-relaxed">{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="pt-6">
            <div className="max-w-2xl">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-ink w-40">SKU</td>
                    <td className="py-3 text-secondary-text">{product.sku}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-ink">Category</td>
                    <td className="py-3 text-secondary-text capitalize">
                      {product.categoryId.replace("cat-", "Category ")}
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-ink">Stock</td>
                    <td className="py-3 text-secondary-text">{product.stock > 0 ? "In Stock" : "Out of Stock"}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 font-medium text-ink">Delivery</td>
                    <td className="py-3 text-secondary-text">{product.deliveryBadge}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="text-center py-12 bg-secondary rounded-2xl">
              <Star className="w-12 h-12 text-gold mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-ink mb-2">No reviews yet</h3>
              <p className="text-secondary-text">Be the first to review this product.</p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-background border-t border-border">
          <div className="container-tight py-16">
            <h2 className="heading-section text-ink mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp, i) => (
                <ProductCard key={rp.id} product={rp as any} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>
      )}

      <BookingModal
        product={product}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}