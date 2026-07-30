"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, IndianRupee, MessageCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_CATEGORIES, BRAND } from "@/lib/constants";
import { submitBooking } from "@/lib/actions";

export function BookingPageClient() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingNumber, setBookingNumber] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    event: "",
    venue: "",
    date: "",
    time: "",
    budget: "",
    instructions: "",
  });

  const updateField = useCallback((field: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value ?? "" }));
  }, []);

  // Build a pre-filled WhatsApp click-to-chat link from the current form values.
  // This is the secondary booking path — it works with no API keys, so a
  // customer can always reach us on WhatsApp even if the form submit fails.
  const whatsappBookingUrl = () => {
    const lines = [
      "Hi Mahek Balloon! I would like to book a decoration.",
      formData.name && `Name: ${formData.name}`,
      formData.phone && `Phone: ${formData.phone}`,
      formData.event && `Event: ${formData.event}`,
      formData.venue && `Venue: ${formData.venue}`,
      (formData.date || formData.time) && `Date: ${formData.date} ${formData.time}`,
      formData.budget && `Budget: ₹${formData.budget}`,
      formData.instructions && `Notes: ${formData.instructions}`,
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(lines)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const fd = new FormData();
    for (const [key, value] of Object.entries(formData)) fd.set(key, value);

    const result = await submitBooking(null, fd);
    setSubmitting(false);

    if (result.success) {
      setBookingNumber(result.bookingNumber);
      setStep("success");
    } else {
      const firstError = Object.values(result.errors).flat()[0];
      setErrorMsg(firstError ?? "We could not save your booking. Please try again or use WhatsApp below.");
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen pt-20 md:pt-24">
        <section className="container-tight py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center p-8 md:p-12 rounded-3xl border border-black/[0.04] bg-white"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-4 tracking-tight">Booking Confirmed!</h1>
            <p className="text-secondary-text mb-6">
              Thank you, {formData.name}! Your {formData.event} decoration booking has been received.
              Our team will confirm via WhatsApp and email within 2 hours.
            </p>
            <div className="p-4 rounded-2xl bg-secondary text-left text-sm space-y-2 mb-6">
              {bookingNumber && (
                <p><strong>Booking Reference:</strong> {bookingNumber}</p>
              )}
              <p><strong>Event:</strong> {formData.event}</p>
              <p><strong>Venue:</strong> {formData.venue}</p>
              <p><strong>Date:</strong> {formData.date} at {formData.time}</p>
              {formData.budget && <p><strong>Budget:</strong> ₹{Number(formData.budget).toLocaleString()}</p>}
            </div>
            <Button
              className="bg-forest text-white hover:bg-forest-hover rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:shadow-forest/20"
              asChild
            >
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=Hi! I've booked ${formData.event} decoration on ${formData.date}. My booking reference is being processed.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Track on WhatsApp
              </a>
            </Button>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
        <div className="container-tight max-w-2xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            Book Your Decoration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            Tell us about your event and our team will create the perfect decoration plan within 2 hours.
          </motion.p>
        </div>
      </section>

      <section className="container-tight py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 md:p-8 rounded-3xl border border-black/[0.04] bg-white"
            >
              <h2 className="text-xl font-semibold text-ink mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 md:p-8 rounded-3xl border border-black/[0.04] bg-white"
            >
              <h2 className="text-xl font-semibold text-ink mb-6">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event">Event Type *</Label>
                  <Select
                    value={formData.event}
                    onValueChange={(v, details) => { updateField("event", v) }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Input
                    id="venue"
                    placeholder="Venue name or address"
                    value={formData.venue}
                    onChange={(e) => updateField("venue", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Event Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField("time", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Estimated budget"
                    value={formData.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Theme preferences, color palette, any specific requests..."
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) => updateField("instructions", e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 md:p-8 rounded-3xl border border-black/[0.04] bg-white"
            >
              <div className="text-sm text-secondary-text space-y-3 mb-6">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-forest" />
                  Our team will confirm your booking via WhatsApp within 2 hours
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-forest" />
                  A 50% advance payment confirms your slot
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-forest" />
                  Free consultation and site visit within Mumbai
                </p>
              </div>
              {errorMsg && (
                <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {errorMsg}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-forest text-white hover:bg-forest-hover rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-forest/20"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Submit Booking Request"
                )}
              </Button>

              <div className="mt-3 flex items-center gap-3">
                <span className="h-px flex-1 bg-black/[0.06]" />
                <span className="text-xs text-secondary-text">or</span>
                <span className="h-px flex-1 bg-black/[0.06]" />
              </div>

              <Button
                type="button"
                size="lg"
                variant="outline"
                className="mt-3 w-full rounded-full border-forest/30 text-forest hover:bg-forest/5"
                asChild
              >
                <a
                  href={whatsappBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Book on WhatsApp
                </a>
              </Button>
            </motion.div>
          </form>
        </div>
      </section>
    </div>
  );
}
