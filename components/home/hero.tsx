"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Truck, ArrowRight, Star, MapPin, Shield, Clock } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { hero, business } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1];

const TRUST_BAR = [
  { icon: Truck, text: hero.features[0] },
  { icon: Shield, text: hero.features[1] },
  { icon: Clock, text: hero.features[2] },
  { icon: MapPin, text: hero.features[3] },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-warm-white">
      <div className="container-tight relative z-10 pt-14 pb-6 md:pt-20 md:pb-8 lg:pt-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-4"
            >
              <span className="section-label">
                {hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.06 }}
              className="heading-hero text-ink mb-4 text-balance"
            >
              {hero.title}
              <br />
              {hero.highlight}{" "}
              <span className="relative inline-block">
                <span className="text-forest">{hero.subtitle}</span>
                <svg className="absolute -bottom-1.5 left-0 w-full h-[6px]" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none">
                  <path d="M2 6C50 2 100 3 150 4C170 4.5 190 5 198 3" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="body-large mb-6 max-w-md text-pretty"
            >
              {hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.14 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <Link href={hero.primaryButton.href} className="btn-primary group">
                {hero.primaryButton.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href={hero.secondaryButton.href} className="btn-secondary">
                {hero.secondaryButton.label}
              </Link>
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=Hi! I'd like to inquire about your decoration services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-forest/40 hover:text-forest transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {hero.whatsappButton}
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.18 }}
              className="flex items-center gap-7"
            >
              {hero.stats.map((stat, i) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-ink tracking-tight">
                    {stat.value}{stat.label.includes("KM") && <span className="text-xs font-semibold">KM</span>}
                    {i === hero.stats.length - 1 && <Star className="w-4 h-4 text-gold fill-gold inline ml-1.5" />}
                  </p>
                  <p className="text-[11px] text-secondary-text mt-0.5">{stat.label.replace(" KM", "")}</p>
                </div>
              )).reduce((acc, el, i) => {
                if (i > 0) acc.push(<div key={`sep-${i}`} className="w-px h-9 bg-black/[0.06]" />);
                acc.push(el);
                return acc;
              }, [] as React.ReactNode[])}
            </motion.div>
          </div>

          {/* Image — 7 columns */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <div className="relative w-full aspect-[16/10] lg:aspect-[16/9] rounded-3xl overflow-hidden shadow-[0_12px_60px_-12px_rgba(0,0,0,0.12)]">
              <Image
                src={hero.image}
                alt="Premium helium balloon arrangement"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

              {/* Floating delivery badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5, ease }}
                className="absolute bottom-5 right-5 lg:bottom-8 lg:right-8"
              >
                <div className="glass-panel rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center">
                    <Truck className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">{hero.features[0]}</p>
                    <p className="text-[11px] text-secondary-text">Within {business.deliveryRadiusKm} KM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-t border-black/[0.04]">
        <div className="container-tight py-3.5">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            {TRUST_BAR.map((b) => (
              <div key={b.text} className="flex items-center gap-2.5 flex-shrink-0">
                <div className="w-8 h-8 rounded-xl bg-forest/5 flex items-center justify-center">
                  <b.icon className="w-4 h-4 text-forest" />
                </div>
                <span className="text-[13px] font-medium text-ink whitespace-nowrap">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
