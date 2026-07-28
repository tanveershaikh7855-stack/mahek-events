"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, Star, Calendar, Trophy, Truck, Award, Heart, Sparkles } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { about, business } from "@/lib/content";

const STAT_ICONS = [Users, Calendar, Trophy, Truck];
const VALUE_ICONS = [Sparkles, Heart, Award, Users];

export function AboutClient() {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-14 md:py-20 bg-background border-b border-black/[0.04]">
        <div className="container-tight max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            {about.title}
            <br />
            <span className="text-forest">{about.highlight}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-6 max-w-2xl mx-auto"
          >
            {about.description}
          </motion.p>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-white border-b border-black/[0.04]">
        <div className="container-tight">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {about.stats.map((stat, index) => {
              const Icon = STAT_ICONS[index % STAT_ICONS.length];
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-forest-light flex items-center justify-center">
                    <Icon className="w-7 h-7 text-forest" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-ink tracking-tight">{stat.value}</p>
                  <p className="text-sm text-secondary-text mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-background">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-section text-ink mb-6">Our Story</h2>
              <div className="space-y-4 text-secondary-text leading-relaxed">
                {about.story.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden"
            >
              <Image
                src="/images/hero-balloons.png"
                alt={`${business.name} - Premium Balloon Decoration`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-white border-y border-black/[0.04]">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-section text-ink mb-4">{about.values.title}</h2>
            <p className="body-large">{about.values.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {about.values.items.map((value, index) => {
              const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl border border-black/[0.04] bg-white text-center hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] transition-shadow duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-forest-light flex items-center justify-center">
                    <Icon className="w-6 h-6 text-forest" />
                  </div>
                  <h3 className="font-semibold text-ink mb-2">{value.title}</h3>
                  <p className="text-sm text-secondary-text">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16 bg-background">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="heading-section text-ink mb-4">{about.team.title}</h2>
            <p className="body-large">{about.team.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {about.team.members.map((member, index) => (
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

      <section className="py-16 md:py-20 bg-forest">
        <div className="container-tight text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{about.cta.title}</h2>
            <p className="text-white/80 mb-8 text-lg">{about.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold text-white hover:bg-gold-hover rounded-full px-8 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20" asChild>
                <Link href={about.cta.primaryButton.href}>{about.cta.primaryButton.label} <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8" asChild>
                <Link href={about.cta.secondaryButton.href}>{about.cta.secondaryButton.label}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
