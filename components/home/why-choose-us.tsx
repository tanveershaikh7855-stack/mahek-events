"use client";
import { motion } from "framer-motion";
import { Truck, Shield, Sparkles, Award, Heart, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "140 KM Delivery Radius",
    description: "Same-day helium balloon delivery across Mumbai, Thane, Navi Mumbai, and extended suburbs.",
    highlight: "Order by 2 PM",
  },
  {
    icon: Sparkles,
    title: "Premium Materials Only",
    description: "We source high-grade latex, foil balloons, and fresh flowers that look better and last longer.",
    highlight: "Decorator Grade",
  },
  {
    icon: Award,
    title: "Expert Design Team",
    description: "Our in-house stylists have 15+ years of combined experience creating elegant decorations.",
    highlight: "Custom Themes",
  },
  {
    icon: Shield,
    title: "Secure & Flexible Payment",
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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-label mb-4 inline-flex"
          >
            Our Promise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.04 }}
            className="heading-section text-ink"
          >
            Why Choose Mahek Decorator?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.08 }}
            className="body-large mt-4"
          >
            We combine premium quality, creative expertise, and reliable service to make every celebration extraordinary.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="group p-6 rounded-2xl border border-border/40 bg-white hover:border-forest/15 transition-colors duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-forest/5 flex items-center justify-center mb-4 group-hover:bg-forest/10 transition-colors duration-200">
                <feature.icon className="w-5 h-5 text-forest" />
              </div>
              <h3 className="text-base font-bold text-ink mb-1.5">{feature.title}</h3>
              <p className="text-sm text-secondary-text leading-relaxed mb-3">{feature.description}</p>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-forest/8 text-forest">
                {feature.highlight}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
