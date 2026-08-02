"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/constants";
import { submitContact } from "@/lib/actions";

const SocialIcon = ({ d, className }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? "w-5 h-5"} aria-hidden="true">
    <path d={d} />
  </svg>
);

const INSTAGRAM_PATH = "M12 2.25c2.17 0 2.43.01 3.27.05.82.04 1.38.17 1.87.36.52.2.97.47 1.41.91.44.44.71.89.91 1.41.19.49.32 1.05.36 1.87.04.84.05 1.1.05 3.27s-.01 2.43-.05 3.27c-.04.82-.17 1.38-.36 1.87-.2.52-.47.97-.91 1.41-.44.44-.89.71-1.41.91-.49.19-1.05.32-1.87.36-.84.04-1.1.05-3.27.05s-2.43-.01-3.27-.05c-.82-.04-1.38-.17-1.87-.36-.52-.2-.97-.47-1.41-.91-.44-.44-.71-.89-.91-1.41-.19-.49-.32-1.05-.36-1.87-.04-.84-.05-1.1-.05-3.27s.01-2.43.05-3.27c.04-.82.17-1.38.36-1.87.2-.52.47-.97.91-1.41.44-.44.89-.71 1.41-.91.49-.19 1.05-.32 1.87-.36.84-.04 1.1-.05 3.27-.05zm0 1.8c-2.14 0-2.39.01-3.22.04-.78.03-1.2.16-1.48.27-.37.14-.63.31-.9.58-.27.27-.44.53-.58.9-.11.28-.24.7-.27 1.48-.03.83-.04 1.08-.04 3.22 0 2.14.01 2.39.04 3.22.03.78.16 1.2.27 1.48.14.37.31.63.58.9.27.27.53.44.9.58.28.11.7.24 1.48.27.83.03 1.08.04 3.22.04 2.14 0 2.39-.01 3.22-.04.78-.03 1.2-.16 1.48-.27.37-.14.63-.31.9-.58.27-.27.44-.53.58-.9.11-.28.24-.7.27-1.48.03-.83.04-1.08.04-3.22 0-2.14-.01-2.39-.04-3.22-.03-.78-.16-1.2-.27-1.48-.14-.37-.31-.63-.58-.9-.27-.27-.53-.44-.9-.58-.28-.11-.7-.24-1.48-.27-.83-.03-1.08-.04-3.22-.04zM12 6.3a5.7 5.7 0 100 11.4A5.7 5.7 0 0012 6.3zm0 9.4a3.7 3.7 0 110-7.4 3.7 3.7 0 010 7.4zm5.68-9.78a1.32 1.32 0 11-2.64 0 1.32 1.32 0 012.64 0z";

const FACEBOOK_PATH = "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";

const WHATSAPP_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

export function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await submitContact(null, new FormData(e.currentTarget));

    setSubmitting(false);

    if (!result.success) {
      const messages = Object.values(result.errors).flat();
      setError(messages[0] ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  const contactItems = [
    { icon: Phone, label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
    { icon: MapPin, label: "Location", value: BRAND.address, href: null },
    { icon: Clock, label: "Business Hours", value: "Mon - Sat, 9:00 AM - 8:00 PM", href: null },
    {
      icon: ({ className }: { className?: string }) => <SocialIcon d={WHATSAPP_PATH} className={className} />,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`,
    },
    {
      icon: ({ className }: { className?: string }) => <SocialIcon d={INSTAGRAM_PATH} className={className} />,
      label: "Instagram",
      value: "@mahek.balloons",
      href: BRAND.instagram,
    },
    {
      icon: ({ className }: { className?: string }) => <SocialIcon d={FACEBOOK_PATH} className={className} />,
      label: "Facebook",
      value: "Mahek Balloon",
      href: BRAND.facebook,
    },
  ] as const;

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
        <div className="container-tight max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            Have a question about balloons, decorations, or delivery? We&apos;re here to help.
          </motion.p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {contactItems.map((item, index) => {
                const IconEl = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    href={item.href || "#"}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.04] bg-white hover:border-forest/20 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {/* Every entry in contactItems is now a component taking
                          an optional className, so no runtime branch is needed. */}
                      <IconEl className="w-6 h-6 text-forest" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-text">{item.label}</p>
                      <p className="font-semibold text-ink">{item.value}</p>
                    </div>
                  </motion.a>
                );
              })}

              <div className="rounded-2xl overflow-hidden border border-black/[0.04] h-64">
                <iframe
                  src={BRAND.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mahek Balloon Location"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 md:p-12 rounded-3xl border border-black/[0.04] bg-white text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-ink mb-4">Message Sent!</h2>
                  <p className="text-secondary-text">
                    Thank you for reaching out. Our team will get back to you within 2 hours during business hours.
                  </p>
                  <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="p-6 md:p-8 rounded-3xl border border-black/[0.04] bg-white space-y-6"
                >
                  <h2 className="text-xl font-semibold text-ink">Send Us a Message</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input id="name" name="name" placeholder="Full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} placeholder="9876543210" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" name="message" placeholder="Tell us how we can help you..." rows={5} required />
                    </div>
                  </div>
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                      {error}
                    </div>
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
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
