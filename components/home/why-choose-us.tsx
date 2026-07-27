"use client";
import { motion } from "framer-motion";
import { Truck, Shield, Sparkles, Award, Heart, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "140 KM Delivery",
    description: "Same-day helium balloon delivery across Mumbai, Thane, Navi Mumbai, and extended suburbs.",
    highlight: "Order by 2 PM",
  },
  {
    icon: Sparkles,
    title: "Premium Materials",
    description: "High-grade latex, foil balloons, and fresh flowers that look better and last longer.",
    highlight: "Decorator Grade",
  },
  {
    icon: Award,
    title: "Expert Design Team",
    description: "In-house stylists with 15+ years of combined experience creating elegant decorations.",
    highlight: "Custom Themes",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Pay via COD, UPI, Credit/Debit cards, or wallets. 50% advance confirms your date.",
    highlight: "COD Available",
  },
  {
    icon: Heart,
    title: "5000+ Happy Customers",
    description: "Trusted by thousands across Mumbai for birthdays, weddings, corporate events, and proposals.",
    highlight: "4.9 Star Average",
  },
  {
    icon: Users,
    title: "End-to-End Service",
    description: "From concept to setup and takedown, we handle everything. You enjoy the celebration.",
    highlight: "Setup & Removal",
  },
];

export function WhyChooseUs() {
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
            Our Promise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.03 }}
            className="heading-section text-ink"
          >
            Why Choose Mahek Decorator?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group p-4 rounded-2xl border border-border/40 bg-white hover:border-forest/15 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-forest/5 flex items-center justify-center mb-3 group-hover:bg-forest/10 transition-colors duration-200">
                <feature.icon className="w-4 h-4 text-forest" />
              </div>
              <h3 className="text-sm font-bold text-ink mb-1">{feature.title}</h3>
              <p className="text-xs text-secondary-text leading-relaxed mb-2.5">{feature.description}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold rounded-full bg-forest/8 text-forest">
                {feature.highlight}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
