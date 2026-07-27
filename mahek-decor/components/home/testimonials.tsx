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
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-label mb-4 inline-flex"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.05 }}
            className="heading-section text-ink"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            Trusted by thousands across Mumbai for balloons, decorations, and celebrations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 md:p-7 rounded-2xl border border-border/60 bg-white card-soft"
            >
              <div className="flex items-center gap-0.5 mb-4">
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
                <Quote className="w-7 h-7 text-forest/10 absolute -top-1 -left-1" />
                <p className="text-ink pl-5 leading-relaxed text-[0.9375rem] text-pretty">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                    {testimonial.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-forest" aria-label="Verified Review" />
                    )}
                  </div>
                  <p className="text-xs text-secondary-text">{testimonial.location}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
