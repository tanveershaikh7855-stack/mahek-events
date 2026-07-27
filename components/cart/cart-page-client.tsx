"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Shield, Truck, Tag } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export function CartPageClient() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const gst = subtotal * 0.05;
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + gst + delivery;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 md:pt-24">
        <section className="container-tight py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag className="w-20 h-20 mx-auto text-border mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4">Your Cart is Empty</h1>
            <p className="text-secondary-text mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added anything yet. Browse our collection of premium helium balloons and decorations.
            </p>
            <Button size="lg" className="bg-forest text-white hover:bg-forest/90" asChild>
              <Link href="/shop">Shop Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-8 bg-background border-b border-border">
        <div className="container-tight">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-ink">Shopping Cart</h1>
              <p className="text-secondary-text">{items.length} {items.length === 1 ? "item" : "items"}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-secondary-text hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.variant}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex gap-4 p-4 rounded-2xl border border-border bg-white"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.slug}`} className="font-semibold text-ink hover:text-forest transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-secondary-text mt-0.5">Variant: {item.variant}</p>
                    )}
                    <p className="text-forest font-semibold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                          className="w-8 h-8 flex items-center justify-center text-secondary-text hover:text-ink"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                          className="w-8 h-8 flex items-center justify-center text-secondary-text hover:text-ink"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
                        <button
                          onClick={() => removeItem(item.productId, item.variant)}
                          className="text-secondary-text hover:text-destructive transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl border border-border bg-white space-y-4 sticky top-24">
                <h3 className="font-semibold text-lg text-ink">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">GST (5%)</span>
                    <span className="font-medium">{formatPrice(gst)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-text">Delivery</span>
                    <span className="font-medium">
                      {delivery === 0 ? (
                        <span className="text-forest">Free</span>
                      ) : (
                        formatPrice(delivery)
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-forest text-white hover:bg-forest/90" asChild>
                  <Link href="/checkout">Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>

                <div className="text-xs text-secondary-text space-y-2 pt-4 border-t border-border">
                  <p className="flex items-center gap-2"><Truck className="w-3 h-3" /> Free delivery on orders above ₹999</p>
                  <p className="flex items-center gap-2"><Shield className="w-3 h-3" /> Secure checkout with COD/UPI/Card</p>
                  <p className="flex items-center gap-2"><Tag className="w-3 h-3" /> Apply coupon at checkout</p>
                </div>

                <Button variant="link" size="sm" className="w-full" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}