"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Users, CreditCard } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { FALLBACK_SERVICES } from "@/lib/seed";
import { formatPrice } from "@/lib/utils";

const serviceImages: Record<string, string> = {
  birthday: "/images/birthday-arch.png",
  wedding: "/images/wedding-room.png",
  corporate: "/images/balloon-wall.png",
  "baby-shower": "/images/baby-shower-arch.png",
  proposal: "/images/bouquet-box.png",
  anniversary: "/images/wedding-room.png",
  haldi: "/images/birthday-arch.png",
  reception: "/images/wedding-room.png",
  "house-decoration": "/images/hero-balloons.png",
  "room-decoration": "/images/birthday-arch.png",
};

export function ServicesSection() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="section-label-gold mb-4 inline-flex"
            >
              Expert Styling
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.04 }}
              className="heading-section text-ink"
            >
              Premium Decoration Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.08 }}
              className="body-large mt-3 max-w-xl"
            >
              From intimate celebrations to grand events, our expert stylists create unforgettable experiences.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.12 }}
          >
            <Button variant="outline" size="lg" asChild>
              <Link href="/services" className="flex items-center gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FALLBACK_SERVICES.slice(0, 6).map((service, index) => (
            <motion.article
              key={service.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-white"
            >
              <Link href={`/services/${service.slug}`} className="block" aria-label={service.name}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={serviceImages[service.slug] || serviceImages.birthday}
                    alt={service.name}
                    fill
                    className="object-cover image-zoom"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold mb-1 block">Decoration Service</span>
                    <h3 className="text-lg font-bold text-white mb-0.5">{service.name}</h3>
                    <p className="text-white/60 text-sm line-clamp-2">{service.description}</p>
                  </div>
                </div>
              </Link>

              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="px-2 py-0.5 text-[10px] rounded-full bg-forest/8 text-forest font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-base font-bold text-ink">{formatPrice(service.priceFrom)}<span className="text-xs font-normal text-secondary-text"> onwards</span></span>
                  <Button size="sm" variant="outline" asChild className="gap-1 h-8 text-xs rounded-full">
                    <Link href={`/booking?service=${service.slug}`}>Book Now <ArrowRight className="w-3.5 h-3.5" /></Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 p-8 md:p-10 rounded-3xl bg-forest-light border border-forest/8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <ServiceStat icon={Calendar} value="Same Day" label="Booking Available" />
            <ServiceStat icon={Users} value="5000+" label="Events Styled" />
            <ServiceStat icon={Star} value="4.9/5" label="Client Rating" />
            <ServiceStat icon={CreditCard} value="Flexible" label="Payment Options" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceStat({ icon: Icon, value, label }: { icon: React.ComponentType<any>; value: string; label: string }) {
  return (
    <div className="p-3">
      <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <Icon className="w-5 h-5 text-forest" />
      </div>
      <p className="text-xl md:text-2xl font-extrabold text-forest tracking-tight">{value}</p>
      <p className="text-xs text-secondary-text mt-1">{label}</p>
    </div>
  );
}
