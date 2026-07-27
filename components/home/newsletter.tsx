"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section className="section-spacing bg-forest">
      <div className="container-tight">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-white/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <h2 className="heading-section text-white mb-3">
              Stay Inspired
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Get decoration ideas, exclusive offers, and new product updates delivered to your inbox.
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.08 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/30" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading" || status === "success"}
                className="w-full pl-11 py-3 bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-full focus:bg-white/15 focus:border-gold/40 text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={!email.trim() || status === "loading" || status === "success"}
              className="bg-gold text-white hover:bg-gold/90 rounded-full font-semibold h-11 px-6 text-sm"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="flex items-center gap-2">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-white/30 text-xs mt-4"
          >
            By subscribing, you agree to our Privacy Policy and consent to receive updates from Mahek Decorator.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
