"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Truck, ArrowRight, Star, MapPin, Shield, Clock } from "lucide-react";
import { BRAND } from "@/lib/constants";

const ease = [0.16, 1, 0.3, 1];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="container-tight relative z-10 pt-20 pb-6 md:pt-28 md:pb-10 lg:pt-36 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[55vh] lg:min-h-[65vh]">
          {/* Content — 5 columns */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-4"
            >
              <span className="section-label">
                Premium Balloon &amp; Decoration Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.06 }}
              className="heading-hero text-ink mb-5 text-balance"
            >
              Make Every
              <br />
              Celebration{" "}
              <span className="relative inline-block">
                <span className="text-forest">Unforgettable</span>
                <svg className="absolute -bottom-1.5 left-0 w-full h-[6px]" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                  <path d="M2 6C50 2 100 3 150 4C170 4.5 190 5 198 3" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.12 }}
              className="body-large mb-8 max-w-md text-pretty"
            >
              Premium helium balloons, elegant bouquets, and bespoke decoration services
              for your most meaningful celebrations. Same-day delivery within 140 KM.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.18 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <Link href="/shop" className="btn-primary group">
                Shop Balloons
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/booking" className="btn-secondary">
                Book Decoration
              </Link>
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=Hi! I'd like to inquire about your decoration services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium text-forest/60 hover:text-forest transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.24 }}
              className="flex items-center gap-8"
            >
              <div>
                <p className="text-2xl font-extrabold text-ink tracking-tight">5000+</p>
                <p className="text-xs text-secondary-text mt-0.5">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-border-light" />
              <div>
                <p className="text-2xl font-extrabold text-ink tracking-tight">140<span className="text-base font-semibold">KM</span></p>
                <p className="text-xs text-secondary-text mt-0.5">Delivery Radius</p>
              </div>
              <div className="w-px h-10 bg-border-light" />
              <div>
                <p className="text-2xl font-extrabold text-ink tracking-tight flex items-center gap-1">4.9 <Star className="w-4 h-4 text-gold fill-gold" /></p>
                <p className="text-xs text-secondary-text mt-0.5">Customer Rating</p>
              </div>
            </motion.div>
          </div>

          {/* Image Composition — 7 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
            className="lg:col-span-7 order-1 lg:order-2 relative"
          >
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/11]">
              {/* Main large image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.2 }}
                className="absolute top-0 right-0 w-[75%] h-[85%] rounded-3xl overflow-hidden shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)]"
              >
                <Image
                  src="/images/hero-balloons.png"
                  alt="Premium helium balloon arrangement"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </motion.div>

              {/* Secondary image — bottom left, overlapping */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.4 }}
                className="absolute bottom-0 left-0 w-[50%] h-[55%] rounded-2xl overflow-hidden shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] border-4 border-white"
              >
                <Image
                  src="/images/birthday-bouquet.png"
                  alt="Luxury balloon bouquet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 28vw"
                />
              </motion.div>

              {/* Small accent image — top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease, delay: 0.55 }}
                className="absolute top-[8%] left-[2%] w-[32%] h-[38%] rounded-2xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] border-3 border-white"
              >
                <Image
                  src="/images/princess-bouquet.png"
                  alt="Elegant flower bouquet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 35vw, 18vw"
                />
              </motion.div>

              {/* Floating delivery badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease }}
                className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8"
              >
                <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Same-Day Delivery</p>
                    <p className="text-[11px] text-secondary-text">Within 140 KM</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating rating badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5, ease }}
                className="absolute top-4 left-[36%] lg:top-6"
              >
                <div className="glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-forest-light border-2 border-white flex items-center justify-center">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">5000+ Happy Customers</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-gold fill-gold" />
                      ))}
                      <span className="text-[10px] text-secondary-text ml-0.5">4.9</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-t border-border/40">
        <div className="container-tight py-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            {[
              { icon: Truck, text: "Same-Day Delivery" },
              { icon: Shield, text: "Secure Payment" },
              { icon: Clock, text: "On-Time Setup" },
              { icon: MapPin, text: "140 KM Coverage" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-forest/5 flex items-center justify-center">
                  <b.icon className="w-4 h-4 text-forest" />
                </div>
                <span className="text-sm font-medium text-ink whitespace-nowrap">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
