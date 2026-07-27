"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MATERIAL_CATEGORIES } from "@/lib/constants";

export function DecorativeMaterialsSection() {
  return (
    <section className="bg-forest py-14 md:py-16">
      <div className="container-tight">
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/80 text-[0.6875rem] font-semibold uppercase tracking-widest mb-4"
          >
            25+ Categories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.04 }}
            className="heading-section text-white"
          >
            Decorative Material
          </motion.h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {MATERIAL_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.02, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/materials/${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-3.5 rounded-2xl hover:bg-white/10 transition-colors duration-150 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl group-hover:bg-white/15 transition-colors duration-150">
                  {cat.icon}
                </div>
                <span className="text-[0.6875rem] font-medium text-white/70 group-hover:text-white transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
