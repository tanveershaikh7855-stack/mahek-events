"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { MATERIAL_CATEGORIES } from "@/lib/constants";

export function DecorativeMaterialsSection() {
  return (
    <section className="section-spacing bg-forest">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <span className="label text-gold mb-3 block">Premium Collection</span>
          <motion.h2
            className="heading-section text-white mb-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
          >
            Decorative Materials
          </motion.h2>
          <motion.p
            className="body-large text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
          >
            Everything you need for unforgettable celebrations — from elegant helium
            balloon bunches to bespoke decoration setups. Browse our curated materials
            and book online.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {MATERIAL_CATEGORIES.slice(0, 12).map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.04, duration: 0.5 }}
            >
              <Link
                href={`/materials/${category.slug}`}
                className="group block relative overflow-hidden rounded-2xl bg-white/10 border border-white/10 p-4 md:p-5 text-center card-lift"
              >
                <div className="text-4xl md:text-5xl mb-3">{category.icon}</div>
                <h3 className="text-sm md:text-[0.9375rem] font-semibold text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-[0.75rem] md:text-xs text-white/60 line-clamp-2">
                  {category.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-gold text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Browse <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 md:mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white px-8 py-4 rounded-2xl font-medium"
            asChild
          >
            <Link href="/materials" className="flex items-center gap-2">
              View All Materials <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}