"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Phone, Mail, MapPin, ClipboardCheck, CreditCard, MessageCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

interface BookingModalProps {
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    salePrice: number | null;
    shortDesc: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingModal({ product, open, onOpenChange }: BookingModalProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [step, setStep] = useState<"details" | "date" | "summary">("details");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const formData = {
    name: "",
    phone: "",
    email: "",
    address: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    quantity: 1,
    specialRequests: "",
    coupon: "",
    paymentMethod: "cod",
  };

  const [data, setData] = useState(formData);

  if (!product) return null;

  const price = product.salePrice && product.salePrice < product.basePrice ? product.salePrice : product.basePrice;
  const advancePayment = Math.round(price * 0.5);
  const total = price * data.quantity;

  const deliverySlots = ["Morning (8AM-12PM)", "Afternoon (12PM-4PM)", "Evening (4PM-7PM)", "Night (7PM-9PM)"];

  const handleWhatsApp = () => {
    const message = `🛍️ *New Booking - ${BRAND.name}*\n\n` +
      `👤 Customer: ${data.name}\n` +
      `📞 Phone: ${data.phone}\n` +
      `📧 Email: ${data.email}\n` +
      `📍 Address: ${data.address}\n\n` +
      `📦 Product: ${product.name}\n` +
      `🔢 Quantity: ${data.quantity}\n` +
      `📅 Date: ${data.eventDate || "TBD"}\n` +
      `🕐 Time: ${data.eventTime || "TBD"}\n` +
      `💰 Amount: ₹${total.toLocaleString("en-IN")}\n` +
      `💵 Advance: ₹${advancePayment.toLocaleString("en-IN")}\n\n` +
      `📝 Special Request: ${data.specialRequests || "None"}\n\n` +
      `_Booking via Mahek Decorator website_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${encoded}`, "_blank");
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!data.name || !data.phone || !data.address) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleWhatsApp();
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-heading font-semibold text-lg text-ink">Book This Item</h2>
                <p className="text-xs text-secondary-text mt-0.5">{product.name}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => onOpenChange(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 px-5 pt-4 pb-2">
              {[
                { label: "Details", active: step === "details" },
                { label: "Date & Time", active: step === "date" },
                { label: "Summary", active: step === "summary" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-2 flex-1">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", s.active ? "bg-forest text-white" : "bg-secondary text-secondary-text")}>
                    {i + 1}
                  </div>
                  <span className={cn("text-xs font-medium hidden sm:inline", s.active ? "text-forest" : "text-secondary-text")}>{s.label}</span>
                  {i < 2 && <div className={cn("flex-1 h-px", i < step ? "bg-forest" : "bg-border")} />}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {step === "details" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="booking-name">Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                      <Input id="booking-name" placeholder="Your full name" className="pl-10" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="booking-phone">Phone Number *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                      <Input id="booking-phone" placeholder="+91 XXXXX XXXXX" className="pl-10" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="booking-email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                      <Input id="booking-email" type="email" placeholder="you@example.com" className="pl-10" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="booking-address">Delivery Address *</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-secondary-text" />
                      <Input id="booking-address" placeholder="House no, street, city" className="pl-10" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="booking-event">Event Type</Label>
                    <Select value={data.eventType} onValueChange={(v) => setData({ ...data, eventType: v })}>
                      <SelectTrigger className="mt-1" id="booking-event">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="baby-shower">Baby Shower</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="festival">Festival</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="booking-quantity">Quantity</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors" onClick={() => setData({ ...data, quantity: Math.max(1, data.quantity - 1) })}>-</button>
                      <span className="text-lg font-semibold text-ink w-8 text-center">{data.quantity}</span>
                      <button className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors" onClick={() => setData({ ...data, quantity: data.quantity + 1 })}>+</button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="booking-requests">Special Instructions</Label>
                    <textarea id="booking-requests" rows={3} className="mt-1 w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-ink placeholder-secondary-text focus:outline-none focus:border-forest resize-none" placeholder="Any special requests..." value={data.specialRequests} onChange={(e) => setData({ ...data, specialRequests: e.target.value })} />
                  </div>
                </div>
              )}

              {step === "date" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="booking-date">Event Date *</Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                      <Input id="booking-date" type="date" className="pl-10" value={data.eventDate} onChange={(e) => setData({ ...data, eventDate: e.target.value })} min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <p className="text-[11px] text-secondary-text mt-1">Select a date at least 1 day in advance</p>
                  </div>
                  <div>
                    <Label>Delivery Time Slot *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {deliverySlots.map((slot) => (
                        <button key={slot} onClick={() => setData({ ...data, eventTime: slot })} className={cn("px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left", data.eventTime === slot ? "border-forest bg-forest-light text-forest" : "border-border text-secondary-text hover:border-forest/30")}>{slot}</button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <h3 className="font-medium text-ink flex items-center gap-2"><CreditCard className="w-4 h-4 text-forest" /> Payment</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["cod", "upi", "card"].map((method) => (
                        <button key={method} onClick={() => setData({ ...data, paymentMethod: method })} className={cn("px-4 py-3 rounded-xl border text-sm font-medium capitalize transition-all", data.paymentMethod === method ? "border-forest bg-forest-light text-forest" : "border-border text-secondary-text")}>{method === "cod" ? "Cash on Delivery" : method === "upi" ? "UPI" : "Card"}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === "summary" && (
                <div className="space-y-4">
                  <div className="bg-secondary rounded-2xl p-4 space-y-3">
                    <h3 className="font-semibold text-ink flex items-center gap-2"><CheckCircle className="w-5 h-5 text-forest" /> Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-secondary-text">Product</span><span className="text-ink font-medium">{product.name}</span></div>
                      <div className="flex justify-between"><span className="text-secondary-text">Unit Price</span><span className="text-ink font-medium">{formatPrice(price)}</span></div>
                      <div className="flex justify-between"><span className="text-secondary-text">Quantity</span><span className="text-ink font-medium">{data.quantity}</span></div>
                      <div className="flex justify-between"><span className="text-secondary-text">Total</span><span className="text-ink font-bold">{formatPrice(total)}</span></div>
                      <div className="flex justify-between"><span className="text-secondary-text">Advance (50%)</span><span className="text-forest font-semibold">{formatPrice(advancePayment)}</span></div>
                      {data.eventDate && <div className="flex justify-between"><span className="text-secondary-text">Date</span><span className="text-ink">{data.eventDate}</span></div>}
                      {data.eventTime && <div className="flex justify-between"><span className="text-secondary-text">Time Slot</span><span className="text-ink">{data.eventTime}</span></div>}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
                    <Label htmlFor="terms" className="text-sm text-secondary-text">I agree to the <Link href="/terms" className="text-forest underline">terms & conditions</Link> and confirm my booking details are correct.</Label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-border">
              {step === "details" && (
                <Button className="w-full h-12 bg-forest text-white font-semibold rounded-xl hover:bg-forest/90 transition-all" onClick={() => setStep("date")}>Continue to Date & Time</Button>
              )}
              {step === "date" && (
                <Button className="w-full h-12 bg-forest text-white font-semibold rounded-xl hover:bg-forest/90 transition-all" onClick={() => setStep("summary")}>Review Booking</Button>
              )}
              {step === "summary" && (
                <Button className="w-full h-12 bg-forest text-white font-semibold rounded-xl hover:bg-forest/90 transition-all flex items-center justify-center gap-2" onClick={handleSubmit} disabled={!agreed || loading}>
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                  Confirm & Send via WhatsApp
                </Button>
              )}
              <button className="w-full mt-2 text-xs text-secondary-text hover:text-ink transition-colors" onClick={() => setStep(step === "details" ? "details" : step === "date" ? "details" : "date")}>← Back</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}