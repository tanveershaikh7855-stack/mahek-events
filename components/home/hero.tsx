"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Truck, Shield, Star, ArrowRight, MapPin, Clock, Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";

const heroImage = "/images/hero-balloons.png";

const stats = [
  { value: "5000+", label: "Happy Customers" },
  { value: "140", label: "KM Delivery" },
  { value: "4.9", label: "Star Rating" },
  { value: "10+", label: "Years Experience" },
];

const trustBadges = [
  { icon: Truck, label: "Same-Day Delivery" },
  { icon: Shield, label: "Secure Payment" },
  { icon: Clock, label: "On-Time Setup" },
  { icon: MapPin, label: "140 KM Coverage" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="container-tight relative z-10 pt-24 pb-8 md:pt-28 md:pb-12 lg:pt-32 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[60vh] lg:min-h-[70vh]">
          {/* Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5"
            >
              <span className="section-label inline-flex">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Balloon & Decor Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className="heading-hero text-ink mb-5 text-balance"
            >
              Celebrate Every
              <br />
              Moment{" "}
              <span className="relative inline-block">
                <span className="text-forest">Beautifully</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C40 2 80 2 100 4C120 6 160 6 198 2" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
              className="body-large text-secondary-text mb-8 max-w-lg text-pretty"
            >
              Premium helium balloons, elegant bouquets, and bespoke decoration services
              crafted for your most meaningful celebrations. Delivered within 140 KM with same-day availability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <Link href="/shop" className="btn-primary">
                Shop Balloons
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/booking" className="btn-secondary">
                Book Decoration
              </Link>
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=Hi! I'd like to inquire about your decoration services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !bg-transparent !border-forest/15 text-forest/70 hover:!text-forest hover:!border-forest/30"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
              className="grid grid-cols-4 gap-4 max-w-md"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-2xl font-bold text-ink tracking-tight">{stat.value}</p>
                  <p className="text-[11px] sm:text-xs text-secondary-text mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src={heroImage}
                alt="Premium helium balloon arrangement in an elegant celebration setting"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>

            {/* Floating customer badge - bottom left of image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-4 left-4 lg:left-6"
            >
              <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-forest-light border-2 border-white flex items-center justify-center">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">5000+ Happy Customers</p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                    ))}
                    <span className="text-[11px] text-secondary-text ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating delivery badge - top right of image */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-4 right-4 lg:top-6 lg:right-6"
            >
              <div className="glass-panel rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-tight">Same-Day</p>
                  <p className="text-[11px] text-secondary-text">Delivery Available</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="bg-white border-t border-border/50">
        <div className="container-tight py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2.5 justify-center">
                <div className="w-8 h-8 rounded-lg bg-forest-light flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-4 h-4 text-forest" />
                </div>
                <span className="text-sm font-medium text-ink">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
