"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Tag, Clock } from "lucide-react";

export type HomeOffer = {
  id: string;
  slug: string;
  title: string;
  badge: string | null;
  subtitle: string | null;
  image: string | null;
  discountLabel: string | null;
  couponCode: string | null;
  endDate: string | null;
};

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function safeSrc(src: string): string {
  const s = src.trim();
  if (s.startsWith("data:") || s.startsWith("http")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

function timeRemaining(endDate: string | null): string | null {
  if (!endDate) return null;
  const end = new Date(endDate).getTime();
  if (Number.isNaN(end)) return null;
  const diff = end - Date.now();
  if (diff <= 0) return null;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days > 30) return null;
  return days === 1 ? "Ends today" : `${days} days left`;
}

/**
 * A high-visibility offers spotlight for the homepage. Uses a warm gold
 * gradient to stand out from the white/forest palette around it. First offer
 * is featured full-width; the remainder tile beneath it.
 */
export function OffersHighlight({ offers }: { offers: HomeOffer[] }) {
  if (!offers || offers.length === 0) return null;

  const [feature, ...rest] = offers;
  const featureRemaining = timeRemaining(feature.endDate);

  return (
    <section
      className="relative py-14 md:py-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 500px at 50% 0%, rgba(201,162,39,0.14), transparent 60%), linear-gradient(180deg,#FBF7E8 0%,#FAFAF8 100%)",
      }}
    >
      <div className="container-tight relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-gold text-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-3"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Live Offers
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.05, ease }}
              className="heading-section text-ink"
            >
              Save on your next celebration
            </motion.h2>
          </div>
          <Link
            href="/offers"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-forest-hover"
          >
            View all offers
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Featured — big banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
        >
          <Link
            href={`/offers/${feature.slug}`}
            className="group relative block rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(24,78,59,0.35)] ring-1 ring-black/5"
          >
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-forest">
              {feature.image ? (
                <Image
                  src={safeSrc(feature.image)}
                  alt={feature.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  unoptimized={feature.image.startsWith("data:")}
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest to-forest-hover">
                  <Sparkles className="w-16 h-16 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-0 flex items-end">
                <div className="p-5 md:p-10 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {feature.badge && (
                      <span className="rounded-full bg-white/95 backdrop-blur-md text-forest px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                        {feature.badge}
                      </span>
                    )}
                    {featureRemaining && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/95 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
                        <Clock className="w-3 h-3" />
                        {featureRemaining}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
                    {feature.title}
                  </h3>
                  {feature.subtitle && (
                    <p className="mt-2 text-sm md:text-base text-white/85 drop-shadow max-w-md">
                      {feature.subtitle}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {feature.discountLabel && (
                      <span className="rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-white shadow-lg">
                        {feature.discountLabel}
                      </span>
                    )}
                    {feature.couponCode && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-forest">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="font-mono tracking-wider">{feature.couponCode}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-white transition-transform group-hover:translate-x-1">
                      View offer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Rest — compact tiles */}
        {rest.length > 0 && (
          <div className="mt-4 md:mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {rest.slice(0, 3).map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.05, duration: 0.45, ease }}
              >
                <Link
                  href={`/offers/${offer.slug}`}
                  className="group relative block rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[16/9] bg-secondary overflow-hidden">
                    {offer.image ? (
                      <Image
                        src={safeSrc(offer.image)}
                        alt={offer.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={offer.image.startsWith("data:")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-forest/5">
                        <Sparkles className="w-8 h-8 text-forest/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {offer.badge && (
                      <span className="absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest">
                        {offer.badge}
                      </span>
                    )}
                    {offer.discountLabel && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white">
                        {offer.discountLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-base font-bold text-ink truncate">
                      {offer.title}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs text-secondary-text truncate">
                        {offer.couponCode ? `Code: ${offer.couponCode}` : (offer.subtitle ?? "")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-forest transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 flex md:hidden justify-center">
          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-white"
          >
            View all offers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
