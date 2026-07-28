"use client";
import { motion } from "framer-motion";
import { Truck, Shield, Sparkles, Award, Heart, Users } from "lucide-react";
import { whyChooseUs } from "@/lib/content";

const ICONS: Record<string, React.ComponentType<any>> = {
  truck: Truck,
  sparkles: Sparkles,
  palette: Award,
  shield: Shield,
  heart: Heart,
  "check-circle": Users,
};

export function WhyChooseUs() {
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
            {whyChooseUs.badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.03 }}
            className="heading-section text-ink"
          >
            {whyChooseUs.title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyChooseUs.items.map((feature, index) => {
            const Icon = ICONS[feature.icon] || Truck;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group p-5 rounded-2xl border border-black/[0.04] bg-white hover:border-forest/15 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-forest/5 flex items-center justify-center mb-4 group-hover:bg-forest/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-forest" />
                </div>
                <h3 className="text-sm font-bold text-ink mb-1.5">{feature.title}</h3>
                <p className="text-xs text-secondary-text leading-relaxed mb-3">{feature.description}</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-forest/5 text-forest">
                  {feature.tag}
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
