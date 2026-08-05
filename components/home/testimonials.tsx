"use client";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThumbnailImage } from "@/lib/image-utils";

export function Testimonials() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-tight">
        <div className="text-center max-w-xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-2xl border border-black/[0.04] bg-white"
            >
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < testimonial.rating ? "text-gold fill-gold" : "text-border"
                    )}
                  />
                ))}
              </div>

              <div className="relative mb-4">
                <Quote className="w-5 h-5 text-forest/10 absolute -top-0.5 -left-0.5" />
                <p className="text-ink pl-4 leading-relaxed text-sm text-pretty">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04]">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-surface">
                  <ThumbnailImage
                    src={testimonial.image}
                    alt={testimonial.name}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                    {testimonial.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-forest" aria-label="Verified Review" />
                    )}
                  </div>
                  <p className="text-[11px] text-secondary-text">{testimonial.location}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
