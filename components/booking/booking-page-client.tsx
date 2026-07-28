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

export function BookingPageClient() {
  const [step, setStep] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setStep("success");
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
            </motion.div>
          </form>
        </div>
      </section>
    </div>
  );
}
