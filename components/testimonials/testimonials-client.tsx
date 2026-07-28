"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, CheckCircle, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TestimonialsClient() {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 md:p-8 rounded-2xl border border-black/[0.04] bg-white"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-4 h-4", i < testimonial.rating ? "text-gold fill-gold" : "text-border")} />
                  ))}
                </div>
                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-forest/10 absolute -top-1 -left-1" />
                  <p className="text-ink pl-5 leading-relaxed text-sm text-pretty">&ldquo;{testimonial.review}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-secondary">
                    <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-ink text-sm">{testimonial.name}</p>
                      {testimonial.verified && <CheckCircle className="w-3.5 h-3.5 text-forest" aria-label="Verified Review" />}
                    </div>
                    <p className="text-xs text-secondary-text">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 p-8 rounded-3xl bg-forest-light border border-forest/10 text-center"
          >
            <p className="text-lg font-semibold text-ink">Join 5000+ happy customers</p>
            <p className="text-secondary-text mt-2">Your satisfaction is our priority. Every review drives us to do better.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
