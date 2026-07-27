"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="text-center max-w-xl mx-auto mb-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="section-label mb-3 inline-flex"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.03 }}
            className="heading-section text-ink"
          >
            What Our Customers Say
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 rounded-2xl border border-border/40 bg-white"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < testimonial.rating ? "text-gold fill-gold" : "text-border"
                    )}
                  />
                ))}
              </div>

              <div className="relative mb-3">
                <Quote className="w-5 h-5 text-forest/8 absolute -top-0.5 -left-0.5" />
                <p className="text-ink pl-3.5 leading-relaxed text-[0.8125rem] text-pretty">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-border/30">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-surface">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-semibold text-ink text-xs">{testimonial.name}</p>
                    {testimonial.verified && (
                      <CheckCircle className="w-3 h-3 text-forest" aria-label="Verified Review" />
                    )}
                  </div>
                  <p className="text-[10px] text-secondary-text">{testimonial.location}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
