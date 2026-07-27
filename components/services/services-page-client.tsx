"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Calendar, MapPin, Users  } from "lucide-react";import { ArrowRight } from "@/components/ui/icons";
import { FALLBACK_SERVICES } from "@/lib/seed";
import { cn, formatPrice } from "@/lib/utils";

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

export function ServicesPageClient() {
  return (
    <div className="min-h-screen">
      <section className="pt-24 pb-12 md:pt-28 md:pb-16 bg-background border-b border-border">
        <div className="container-tight text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            Premium Decoration Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            From intimate celebrations to grand events, our expert stylists create unforgettable experiences.
          </motion.p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-tight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FALLBACK_SERVICES.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white rounded-2xl border border-border overflow-hidden card-lift"
              >
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-0">
                  <div className="sm:col-span-2 relative aspect-[4/3] sm:aspect-auto overflow-hidden bg-secondary">
                    <Image
                      src={serviceImages[service.slug] || serviceImages.birthday}
                      alt={service.name}
                      fill
                      className="object-cover image-zoom"
                      sizes="(max-width: 640px) 100vw, 40vw"
                    />
                  </div>
                  <div className="sm:col-span-3 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">Decoration Service</Badge>
                      <h3 className="text-xl font-semibold text-ink mb-2">{service.name}</h3>
                      <p className="text-sm text-secondary-text mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.features.map((f) => (
                          <span key={f} className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-forest-light text-forest">
                            <CheckCircle className="w-3 h-3" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-sm text-secondary-text">Starting from</span>
                        <p className="text-xl font-bold text-ink">{formatPrice(service.priceFrom)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/booking?service=${service.slug}`}>Book Now</Link>
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/services/${service.slug}`}>
                            Details <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-border">
        <div className="container-tight text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-2xl bg-forest-light border border-forest/20"
          >
            <Calendar className="w-12 h-12 text-forest mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-4">
              Ready to Transform Your Event?
            </h2>
            <p className="text-secondary-text mb-8 max-w-lg mx-auto">
              Tell us about your event and we'll create a custom decoration plan that matches your vision and budget.
            </p>
            <Button size="lg" className="bg-forest text-white hover:bg-forest/90" asChild>
              <Link href="/booking" className="flex items-center gap-2">
                Book Your Decoration <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
