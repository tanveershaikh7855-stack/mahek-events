"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Flower2 } from "lucide-react";
import type { Product } from "@/lib/content";
import { formatPrice } from "@/lib/utils";

const FALLBACK_IMAGE = "/images/IMG-20260729-WA0075.jpg";

/**
 * Homepage flower-bouquet showcase. Replaces the old "Decorative Material"
 * icon grid. Products come from the `flower-bouquets` category in the database,
 * so anything the admin publishes there appears here automatically.
 */
export function FlowerBouquetsSection({ products }: { products: Product[] }) {
  // Nothing published yet — hide the section rather than render an empty strip.
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-forest py-12 md:py-16">
      <div className="container-tight">
        <div className="text-center mb-9">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-[0.6875rem] font-bold uppercase tracking-widest mb-3"
          >
            <Flower2 className="w-3.5 h-3.5" />
            Fresh &amp; Handcrafted
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.03 }}
            className="text-xl md:text-3xl font-extrabold text-white tracking-tight"
          >
            Flower Bouquets
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.06 }}
            className="text-white/60 text-sm mt-2 max-w-md mx-auto"
          >
            Hand-tied blooms for birthdays, anniversaries and every moment worth
            marking.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {products.map((product, index) => {
            const image = product.images?.[0] ?? FALLBACK_IMAGE;
            const price =
              product.salePrice && product.salePrice < product.basePrice
                ? product.salePrice
                : product.basePrice;
            const hasDiscount =
              product.salePrice !== null && product.salePrice < product.basePrice;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white/[0.06] border border-white/10 hover:border-white/25 transition-colors duration-300"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      unoptimized={image.startsWith("data:")}
                    />
                    {hasDiscount && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold text-white">
                        SALE
                      </span>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-semibold text-white leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-white font-bold text-sm md:text-base">
                        {formatPrice(price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-white/40 text-xs line-through">
                          {formatPrice(product.basePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/shop?category=flower-bouquets"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-white/90"
          >
            View all bouquets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
