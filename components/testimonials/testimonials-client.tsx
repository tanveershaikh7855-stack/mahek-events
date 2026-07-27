"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, CheckCircle, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TestimonialsClient() {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-8 md:py-12 bg-background border-b border-border">
        <div className="container-tight text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            What Our Customers Say
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            Trusted by thousands across Mumbai for premium balloons and decorations.
          </motion.p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-tight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 md:p-8 rounded-2xl border border-border bg-white"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-5 h-5", i < testimonial.rating ? "text-gold fill-gold" : "text-border")} />
                  ))}
                </div>
                <div className="relative mb-4">
                  <Quote className="w-8 h-8 text-forest-light absolute -top-2 -left-2 opacity-50" />
                  <p className="text-ink pl-6 leading-relaxed text-pretty">&ldquo;{testimonial.review}&rdquo;</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-secondary">
                    <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-ink">{testimonial.name}</p>
                      {testimonial.verified && <CheckCircle className="w-4 h-4 text-forest" aria-label="Verified Review" />}
                    </div>
                    <p className="text-sm text-secondary-text">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-8 rounded-2xl bg-forest-light border border-forest/20 text-center"
          >
            <p className="text-lg font-semibold text-ink">Join 5000+ happy customers</p>
            <p className="text-secondary-text mt-2">Your satisfaction is our priority. Every review drives us to do better.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}