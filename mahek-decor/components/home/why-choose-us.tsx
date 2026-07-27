"use client";
import { motion } from "framer-motion";
import { Truck, Shield, Sparkles, Award, Heart, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "140 KM Delivery Radius",
    description: "Same-day helium balloon delivery across Mumbai, Thane, Navi Mumbai, and extended suburbs within 140 KM.",
    highlight: "Order by 2 PM",
  },
  {
    icon: Sparkles,
    title: "Premium Materials Only",
    description: "We source high-grade latex, foil balloons, and fresh flowers that look better and last longer than standard alternatives.",
    highlight: "Decorator Grade",
  },
  {
    icon: Award,
    title: "Expert Design Team",
    description: "Our in-house stylists have 15+ years of combined experience creating elegant, Instagram-worthy decorations for every occasion.",
    highlight: "Custom Themes",
  },
  {
    icon: Shield,
    title: "Secure & Flexible Payment",
    description: "Pay via Cash on Delivery, UPI, Credit/Debit cards, or wallets. For decoration bookings, only 50% advance confirms your date.",
    highlight: "COD Available",
  },
  {
    icon: Heart,
    title: "5000+ Happy Customers",
    description: "Trusted by thousands across Mumbai for birthdays, weddings, corporate events, and intimate proposals. Read their stories.",
    highlight: "4.9\u2605 Average",
  },
  {
    icon: Users,
    title: "End-to-End Service",
    description: "From concept to setup and takedown, we handle everything. You enjoy the celebration while we manage the details.",
    highlight: "Setup & Removal",
  },
];

export function WhyChooseUs() {
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
            Our Promise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.05 }}
            className="heading-section text-ink"
          >
            Why Choose Mahek Decorator?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            We combine premium quality, creative expertise, and reliable service to make every celebration extraordinary.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group p-6 md:p-7 rounded-2xl border border-border/60 bg-white card-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-forest-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-forest" />
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">{feature.title}</h3>
              <p className="text-sm text-secondary-text leading-relaxed mb-4">{feature.description}</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-semibold rounded-full bg-forest-light text-forest">
                {feature.highlight}
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
