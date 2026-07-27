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
    <section className="py-10 md:py-16 bg-forest">
      <div className="container-tight">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="w-10 h-10 mx-auto mb-4 rounded-xl bg-white/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mb-2 tracking-tight">
              Stay Inspired
            </h2>
            <p className="text-white/50 text-xs leading-relaxed mb-6">
              Decoration ideas, exclusive offers, and new products. No spam.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.06 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading" || status === "success"}
                className="w-full pl-10 py-2.5 bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-full focus:bg-white/15 focus:border-gold/40 text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={!email.trim() || status === "loading" || status === "success"}
              className="bg-gold text-white hover:bg-gold/90 rounded-full font-semibold h-10 px-5 text-sm"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Subscribe <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </Button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.12 }}
            className="text-white/25 text-[10px] mt-3"
          >
            By subscribing, you agree to our Privacy Policy.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
