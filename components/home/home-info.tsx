"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail, Truck, Shield, CreditCard } from "lucide-react";
import { business, socials } from "@/lib/content";
import { BRAND } from "@/lib/constants";

const infoItems = [
  {
    icon: MapPin,
    label: "Visit Us",
    value: business.address,
    href: business.googleMapsUrl,
  },
  {
    icon: Phone,
    label: "Call Us",
    value: business.phoneFormatted,
    href: `tel:${business.phone}`,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Sat, 9:00 AM - 8:00 PM",
    href: null,
  },
  {
    icon: Mail,
    label: "Email Us",
    value: business.email,
    href: `mailto:${business.email}`,
  },
];

const highlights = [
  { icon: Truck, title: `${business.deliveryRadiusKm} KM Delivery`, desc: "Same-day delivery across Pune & beyond" },
  { icon: Shield, title: "Secure Payment", desc: "COD, UPI, Credit/Debit cards accepted" },
  { icon: CreditCard, title: "50% Advance", desc: "Confirm your booking with 50% advance" },
];

export function HomeInfoSection() {
  return (
    <section className="bg-white border-t border-black/[0.04]">
      <div className="container-tight py-14 md:py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="section-label mb-3 inline-flex"
          >
            Get in Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.03 }}
            className="heading-section text-ink"
          >
            {business.name} Info
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-2xl border border-black/[0.04] bg-background text-center"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-forest/5 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-forest" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-forest/60 mb-1">{item.label}</p>
              {item.href ? (
                <Link href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-ink hover:text-forest transition-colors">
                  {item.value}
                </Link>
              ) : (
                <p className="text-sm font-medium text-ink">{item.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {highlights.map((h, index) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 p-5 rounded-2xl bg-forest-light border border-forest/8"
            >
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <h.icon className="w-4.5 h-4.5 text-forest" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{h.title}</p>
                <p className="text-xs text-secondary-text mt-0.5">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          className="text-center"
        >
          <p className="text-sm text-secondary-text mb-3">
            Follow us on social media for the latest designs and offers
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-hover transition-all duration-300 hover:shadow-lg hover:shadow-forest/20"
            >
              Instagram
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-white text-forest border border-forest text-sm font-semibold hover:bg-forest-light transition-all duration-300"
            >
              WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
