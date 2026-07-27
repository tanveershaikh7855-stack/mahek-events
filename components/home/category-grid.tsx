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

interface CategoryCardProps {
  name: string;
  slug: string;
  subtitle: string;
  image: string;
  type: "product" | "service";
  itemCount?: number;
}

function CategoryCard({ name, slug, subtitle, image, type, itemCount }: CategoryCardProps) {
  const href = type === "product" ? `/shop?category=${slug}` : `/services/${slug}`;
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-white cursor-pointer"
    >
      <Link href={href} className="block" aria-label={`View ${name}`}>
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          {itemCount !== undefined && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-ink">
              {itemCount}+ items
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-forest/70 mb-1">
            {type === "product" ? "Shop" : "Service"}
          </p>
          <h3 className="text-[0.9375rem] font-semibold text-ink mb-0.5 group-hover:text-forest transition-colors">{name}</h3>
          <p className="text-xs text-secondary-text line-clamp-1">{subtitle}</p>
          <div className="flex items-center gap-1.5 text-forest font-medium text-xs mt-2.5 group-hover:gap-2 transition-all">
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function CategoryGrid() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-label mb-4 inline-flex"
            >
              Browse Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.04 }}
              className="heading-section text-ink"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.08 }}
              className="body-large mt-3 max-w-xl"
            >
              Discover our curated collection of premium helium balloons, bouquets, and party essentials.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.12 }}
          >
            <Button variant="outline" size="lg" className="w-full md:w-auto" asChild>
              <Link href="/shop" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {SHOP_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

        <div className="mt-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="section-label-gold mb-4 inline-flex"
              >
                Event Styling
              </motion.span>
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.04 }}
                className="heading-section text-ink"
              >
                Decoration Services
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.08 }}
                className="body-large mt-3 max-w-xl"
              >
                Professional event styling for birthdays, weddings, corporate events, and special occasions.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.12 }}
            >
              <Button variant="outline" size="lg" className="w-full md:w-auto" asChild>
                <Link href="/services" className="flex items-center gap-2">
                  All Services <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {SERVICE_CATEGORIES.slice(0, 5).map((cat, index) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
