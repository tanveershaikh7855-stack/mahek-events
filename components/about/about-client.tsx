"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Star, Calendar, Trophy, Truck, Award, Heart, Sparkles  } from "lucide-react";import { ArrowRight } from "@/components/ui/icons";
import { BRAND } from "@/lib/constants";

const STATS = [
  { label: "Customers Served", value: "5000+", icon: Users },
  { label: "Events Decorated", value: "1000+", icon: Calendar },
  { label: "Years Experience", value: "10+", icon: Trophy },
  { label: "Delivery Radius", value: "140 KM", icon: Truck },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Quality First",
    description: "We use only premium-grade balloons, fresh flowers, and decorator materials. Every detail matters.",
  },
  {
    icon: Heart,
    title: "Customer Centric",
    description: "Your vision is our blueprint. We listen, understand, and deliver beyond expectations.",
  },
  {
    icon: Award,
    title: "Design Excellence",
    description: "Our in-house stylists combine modern aesthetics with timeless elegance for every event.",
  },
  {
    icon: Users,
    title: "End-to-End Service",
    description: "From consultation to setup to takedown, we handle everything so you can enjoy your celebration.",
  },
];

const TEAM = [
  {
    name: "Mahek Sharma",
    role: "Founder & Creative Director",
    image: "/images/princess-bouquet.png",
    description: "Founded Mahek Decorator with a vision to bring premium balloon artistry to Mumbai celebrations.",
  },
  {
    name: "Priya Verma",
    role: "Lead Stylist",
    image: "/images/bouquet-box.png",
    description: "10+ years of experience creating stunning event transformations across the city.",
  },
  {
    name: "Arun Patel",
    role: "Operations Manager",
    image: "/images/draveewi-bouquet.png",
    description: "Ensures every delivery and setup happens on time, every time, within 140 KM radius.",
  },
];

export function AboutClient() {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-12 md:py-20 bg-background border-b border-border">
        <div className="container-tight max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            Making Celebrations
            <br />
            <span className="text-forest">Beautiful Since 2015</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-6 max-w-2xl mx-auto"
          >
            Mahek Decorator was born from a simple idea — every celebration deserves to look as special as the moment itself.
            What started as a small balloon delivery service in Mumbai has grown into a trusted name for premium decorations.
          </motion.p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-b border-border">
        <div className="container-tight">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-forest-light flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-forest" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-ink">{stat.value}</p>
                <p className="text-sm text-secondary-text mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-section text-ink mb-6">Our Story</h2>
              <div className="space-y-4 text-secondary-text leading-relaxed">
                <p>
                  Founded in 2015, Mahek Decorator began as a passion project — delivering beautifully arranged
                  helium balloons for birthdays and celebrations across Mumbai.
                </p>
                <p>
                  As demand grew, so did our vision. Today we offer a full range of decoration services including
                  balloon bouquets, flower arrangements, wedding decor, corporate event styling, and more.
                </p>
                <p>
                  Every project — whether a simple balloon bunch or a full wedding setup — receives the same
                  attention to detail, premium materials, and commitment to excellence.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src="/images/hero-balloons.png"
                alt="Mahek Decorator - Premium Balloon Decoration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white border-y border-border">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-section text-ink mb-4">Our Values</h2>
            <p className="body-large">The principles that guide every celebration we create.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-white text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-forest-light flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-forest" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{value.title}</h3>
                <p className="text-sm text-secondary-text">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-section text-ink mb-4">Meet Our Team</h2>
            <p className="body-large">The creative minds behind every beautiful celebration.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-secondary">
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="128px" />
                </div>
                <h3 className="font-semibold text-ink text-lg">{member.name}</h3>
                <p className="text-sm text-forest font-medium mb-2">{member.role}</p>
                <p className="text-sm text-secondary-text">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-forest">
        <div className="container-tight text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Create Magic?</h2>
            <p className="text-white/80 mb-8">Let&apos;s make your next celebration unforgettable.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold text-ink hover:bg-gold/90" asChild>
                <Link href="/booking">Book Decoration <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
