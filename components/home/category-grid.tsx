"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SHOP_CATEGORIES, SERVICE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";

const categoryImages: Record<string, string> = {
  "helium-balloons": "/images/balloon-wall.png",
  "balloon-bouquets": "/images/birthday-bouquet.png",
  "balloon-packets": "/images/baby-welcome.png",
  "party-supplies": "/images/birthday-arch.png",
  "flower-bouquets": "/images/princess-bouquet.png",
};

const serviceImages: Record<string, string> = {
  birthday: "/images/birthday-arch.png",
  anniversary: "/images/wedding-room.png",
  "baby-shower": "/images/baby-shower-arch.png",
  corporate: "/images/balloon-wall.png",
  wedding: "/images/wedding-room.png",
};

function CategoryCard({ name, slug, subtitle, image, type, itemCount }: {
  name: string; slug: string; subtitle: string; image: string; type: "product" | "service"; itemCount?: number;
}) {
  const href = type === "product" ? `/shop?category=${slug}` : `/services/${slug}`;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/40 bg-white cursor-pointer">
      <Link href={href} className="block" aria-label={`View ${name}`}>
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          {itemCount !== undefined && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-semibold text-ink">
              {itemCount}+ items
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-forest/70 mb-0.5">
            {type === "product" ? "Shop" : "Service"}
          </p>
          <h3 className="text-[0.8125rem] font-semibold text-ink mb-0.5 group-hover:text-forest transition-colors">{name}</h3>
          <p className="text-[10px] text-secondary-text line-clamp-1">{subtitle}</p>
          <div className="flex items-center gap-1 text-forest font-medium text-[10px] mt-2 group-hover:gap-1.5 transition-all">
            <span>Explore</span>
            <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function CategoryGrid() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SHOP_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CategoryCard
                name={cat.name}
                slug={cat.slug}
                subtitle={cat.subtitle}
                image={categoryImages[cat.slug] || `/images/balloon-wall.png`}
                type="product"
                itemCount={20}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SERVICE_CATEGORIES.slice(0, 5).map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <CategoryCard
                  name={cat.name}
                  slug={cat.slug}
                  subtitle={cat.subtitle}
                  image={serviceImages[cat.slug] || `/images/birthday-arch.png`}
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
