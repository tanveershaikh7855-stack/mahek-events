"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MATERIAL_CATEGORIES } from "@/lib/constants";

export function DecorativeMaterialsSection() {
  return (
    <section className="bg-forest py-10 md:py-12">
      <div className="container-tight">
        <div className="text-center mb-8">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[0.625rem] font-semibold uppercase tracking-widest mb-3"
          >
            25+ Categories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.03 }}
            className="text-xl md:text-2xl font-extrabold text-white tracking-tight"
          >
            Decorative Material
          </motion.h2>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {MATERIAL_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: index * 0.015, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/materials/${cat.slug}`}
                className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-white/10 transition-colors duration-150 text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base group-hover:bg-white/15 transition-colors duration-150">
                  {cat.icon}
                </div>
                <span className="text-[9px] font-medium text-white/70 group-hover:text-white transition-colors leading-tight">
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
