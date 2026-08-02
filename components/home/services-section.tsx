"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Users, CreditCard } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { FALLBACK_SERVICES } from "@/lib/seed";
import { formatPrice } from "@/lib/utils";

type ServiceCard = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceFrom: number;
  image: string;
  features: string[];
};

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

export function ServicesSection({ services }: { services?: ServiceCard[] }) {
  // Falls back to the static list if the home page didn't pass DB services.
  const list = (services && services.length > 0 ? services : FALLBACK_SERVICES).slice(0, 6);
  return (
    <section className="section-spacing bg-white">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="section-label-gold mb-3 inline-flex"
            >
              Expert Styling
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.03 }}
              className="heading-section text-ink"
            >
              Premium Decoration Services
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08 }}
          >
            <Button variant="outline" size="sm" asChild>
              <Link href="/services" className="flex items-center gap-1.5 text-xs">
                View All Services <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {list.map((service, index) => (
            <motion.article
              key={service.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-black/[0.04] bg-white"
            >
              <Link href={`/services/${service.slug}`} className="block" aria-label={service.name}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={service.image || serviceImages[service.slug] || serviceImages.birthday}
                    alt={service.name}
                    fill
                    className="object-cover image-zoom"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1 block">Decoration Service</span>
                    <h3 className="text-base font-bold text-white mb-0.5">{service.name}</h3>
                    <p className="text-white/60 text-xs line-clamp-1">{service.description}</p>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {service.features.slice(0, 3).map((feature) => (
                    <span key={feature} className="px-2.5 py-1 text-[10px] rounded-lg bg-forest/5 text-forest font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
                  <span className="text-sm font-bold text-ink">{formatPrice(service.priceFrom)}<span className="text-[11px] font-normal text-secondary-text"> onwards</span></span>
                  <Button size="sm" variant="outline" asChild className="gap-1 h-8 text-[11px] rounded-full px-3">
                    <Link href={`/booking?service=${service.slug}`}>Book Now <ArrowRight className="w-3 h-3" /></Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 p-7 md:p-9 rounded-3xl bg-forest-light border border-forest/8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 text-center">
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
    <div className="p-2">
      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-white flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <Icon className="w-5 h-5 text-forest" />
      </div>
      <p className="text-xl md:text-2xl font-extrabold text-forest tracking-tight">{value}</p>
      <p className="text-[11px] text-secondary-text mt-1">{label}</p>
    </div>
  );
}
