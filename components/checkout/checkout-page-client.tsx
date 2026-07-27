"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  CreditCard,
  Truck,
  Shield,
  Lock,
  Loader2,
  Radio,
  Wallet,
  Landmark,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";

const PAYMENT_METHODS = [
  { value: "COD", label: "Cash on Delivery", icon: Wallet, desc: "Pay when you receive" },
  { value: "UPI", label: "UPI (GPay/PhonePe/Paytm)", icon: Smartphone, desc: "Instant payment via UPI" },
  { value: "CARD", label: "Credit/Debit Card", icon: Landmark, desc: "Visa, Mastercard, RuPay" },
];

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const gst = subtotal * 0.05;
  const delivery = subtotal >= 999 ? 0 : 99;
  const total = subtotal + gst + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setSubmitting(false);
    setCompleted(true);
    setTimeout(() => router.push("/"), 3000);
  };

  if (items.length === 0 && !completed) {
    return (
      <div className="min-h-screen pt-20 md:pt-24">
        <section className="container-tight py-16 md:py-24 text-center">
          <ShoppingBag className="w-20 h-20 mx-auto text-border mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4">Your Cart is Empty</h1>
          <p className="text-secondary-text mb-8">Add items to your cart before checking out.</p>
          <Button size="lg" className="bg-forest text-white" asChild>
            <Link href="/shop">Shop Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </section>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen pt-20 md:pt-24">
        <section className="container-tight py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center p-8 rounded-2xl border border-border bg-white"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4">Order Placed!</h1>
            <p className="text-secondary-text mb-6">
              Thank you for your order! You&apos;ll receive a confirmation via WhatsApp shortly.
            </p>
            <Button className="bg-forest text-white hover:bg-forest/90" asChild>
              <Link href="/shop">Continue Shopping <ArrowRight className="ml-2 w-5 h-5" /></Link>
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
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Checkout</h1>
          <p className="text-secondary-text">Complete your order</p>
        </div>
      </section>

      <section className="py-8">
        <div className="container-tight">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl border border-border bg-white space-y-4"
                >
                  <h2 className="text-lg font-semibold text-ink">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="Enter your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea id="address" placeholder="House/Flat No., Street, Landmark" required rows={2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input id="city" placeholder="Mumbai" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input id="pincode" placeholder="400001" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input id="state" placeholder="Maharashtra" required />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-2xl border border-border bg-white space-y-4"
                >
                  <h2 className="text-lg font-semibold text-ink">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.value}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-xl border border-border cursor-pointer transition-all hover:border-forest/30",
                          paymentMethod === method.value && "border-forest bg-forest-light"
                        )}
                      >
                        <RadioGroupItem value={method.value} className="text-forest" />
                        <div className="w-10 h-10 rounded-lg bg-forest-light flex items-center justify-center">
                          <method.icon className="w-5 h-5 text-forest" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-ink text-sm">{method.label}</p>
                          <p className="text-xs text-secondary-text">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-2xl border border-border bg-white space-y-4"
                >
                  <h2 className="text-lg font-semibold text-ink">Order Notes</h2>
                  <Textarea
                    placeholder="Special delivery instructions, preferred time, gate code, etc."
                    rows={3}
                  />
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <div className="p-6 rounded-2xl border border-border bg-white space-y-4 sticky top-24">
                  <h3 className="font-semibold text-lg text-ink">Order Summary</h3>

                  <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                    {items.map((item, i) => (
                      <div key={`${item.productId}-${item.variant}`} className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink line-clamp-1">{item.name}</p>
                          <p className="text-xs text-secondary-text">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-ink">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text">GST (5%)</span>
                      <span>{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Delivery</span>
                      <span className={delivery === 0 ? "text-forest" : ""}>{delivery === 0 ? "Free" : formatPrice(delivery)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-forest text-white hover:bg-forest/90"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Place Order - {formatPrice(total)}
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-secondary-text space-y-1">
                    <p className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure & encrypted checkout</p>
                    <p className="flex items-center gap-1"><Truck className="w-3 h-3" /> WhatsApp order confirmation</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function ShoppingBag({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}