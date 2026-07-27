"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SHOP_CATEGORIES, SERVICE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { Package, PartyPopper, Flower2, Gift, Balloon } from "lucide-react";

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
  haldi: "/images/birthday-arch.png",
  reception: "/images/wedding-room.png",
  "house-decoration": "/images/hero-balloons.png",
  proposal: "/images/bouquet-box.png",
  "room-decoration": "/images/birthday-arch.png",
};

const productCategoryIcons: Record<string, React.ComponentType<any>> = {
  "helium-balloons": Balloon,
  "balloon-bouquets": Gift,
  "balloon-packets": Package,
  "party-supplies": PartyPopper,
  "flower-bouquets": Flower2,
};

const serviceCategoryIcons: Record<string, React.ComponentType<any>> = {
  birthday: PartyPopper,
  anniversary: Gift,
  "baby-shower": Flower2,
  corporate: Package,
  wedding: Flower2,
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
      whileHover={{ y: -6 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white card-soft cursor-pointer"
    >
      <Link href={href} className="block" aria-label={`View ${name}`}>
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {itemCount !== undefined && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-ink">
              {itemCount} items
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="label text-forest mb-1.5">{type === "product" ? "Shop" : "Service"}</p>
          <h3 className="text-base font-semibold text-ink mb-1 group-hover:text-forest transition-colors">{name}</h3>
          <p className="text-sm text-secondary-text line-clamp-1">{subtitle}</p>
          <div className="flex items-center gap-1.5 text-forest font-medium text-sm mt-3 group-hover:gap-2.5 transition-all">
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.05 }}
              className="heading-section text-ink"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="body-large mt-3 max-w-xl"
            >
              Discover our curated collection of premium helium balloons, bouquets, and party essentials.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15 }}
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
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.05 }}
                className="heading-section text-ink"
              >
                Decoration Services
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 }}
                className="body-large mt-3 max-w-xl"
              >
                Professional event styling for birthdays, weddings, corporate events, and special occasions.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.15 }}
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
