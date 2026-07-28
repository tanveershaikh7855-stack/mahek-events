"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FREQUENTLY_ASKED_QUESTIONS } from "@/lib/constants";
import { faqPage } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FaqPageClient() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FREQUENTLY_ASKED_QUESTIONS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
        <div className="container-tight max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-4"
          >
            {faqPage.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
            <Input
              type="text"
              placeholder={faqPage.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-tight max-w-3xl mx-auto">
          {filtered.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="border-b border-black/[0.04] last:border-b-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left group"
              >
                <h3 className="text-sm md:text-base font-medium text-ink group-hover:text-forest transition-colors pr-4">{faq.question}</h3>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-300 text-secondary-text",
                    openIndex === index && "rotate-180 text-forest"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm text-secondary-text leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto text-border mb-4" />
              <h3 className="text-lg font-semibold text-ink mb-2">No results found</h3>
              <p className="text-secondary-text">Try a different search term.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
