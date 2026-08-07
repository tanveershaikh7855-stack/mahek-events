"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SHOP_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";

const categoryImages: Record<string, string> = {
  "helium-balloons": "/images/balloon-wall.png",
  "balloon-bouquets": "/images/birthday-bouquet.png",
  "balloon-packets": "/images/baby-welcome.png",
  "party-supplies": "/images/birthday-arch.png",
  "flower-bouquets": "/images/princess-bouquet.png",
};

export type CategoryImageOverrides = Record<string, string>;

export type ServiceTile = { slug: string; name: string; subtitle: string; image: string };

function CategoryCard({ name, slug, subtitle, image, type, itemCount }: {
  name: string; slug: string; subtitle: string; image: string; type: "product" | "service"; itemCount?: number;
}) {
  const href = type === "product" ? `/shop?category=${slug}` : `/services/${slug}`;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-black/[0.04] bg-white cursor-pointer card-lift">
      <Link href={href} className="block" aria-label={`View ${name}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
          {itemCount !== undefined && itemCount > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-ink shadow-sm tabular-nums">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </div>
          )}
        </div>
        <div className="p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-forest/60 mb-1">
            {type === "product" ? "Shop" : "Service"}
          </p>
          <h3 className="text-sm font-semibold text-ink mb-0.5 group-hover:text-forest transition-colors duration-200">{name}</h3>
          <p className="text-[11px] text-secondary-text line-clamp-1">{subtitle}</p>
          <div className="flex items-center gap-1.5 text-forest font-medium text-[11px] mt-2.5 group-hover:gap-2 transition-all duration-300">
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function CategoryGrid({
  productImages = {},
  productCounts = {},
  services = [],
}: {
  productImages?: CategoryImageOverrides;
  productCounts?: Record<string, number>;
  services?: ServiceTile[];
} = {}) {
  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="section-label mb-3 inline-flex"
            >
              Browse Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.03 }}
              className="heading-section text-ink"
            >
              Shop by Category
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08 }}
          >
            <Button variant="outline" size="sm" className="w-full md:w-auto" asChild>
              <Link href="/shop" className="flex items-center gap-1.5 text-xs">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {SHOP_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <CategoryCard
                name={cat.name}
                slug={cat.slug}
                subtitle={cat.subtitle}
                image={productImages[cat.slug] || categoryImages[cat.slug] || `/images/balloon-wall.png`}
                type="product"
                itemCount={productCounts[cat.slug]}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="section-label-gold mb-3 inline-flex"
              >
                Event Styling
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.03 }}
                className="heading-section text-ink"
              >
                Decoration Services
              </motion.h3>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.08 }}
            >
              <Button variant="outline" size="sm" className="w-full md:w-auto" asChild>
                <Link href="/services" className="flex items-center gap-1.5 text-xs">
                  All Services <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {services.map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <CategoryCard
                  name={cat.name}
                  slug={cat.slug}
                  subtitle={cat.subtitle}
                  image={cat.image || `/images/birthday-arch.png`}
                  type="service"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
