"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2 } from "lucide-react";
import { ArrowRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletter } from "@/lib/content";
import { subscribe } from "@/lib/actions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setError("");

    const formData = new FormData();
    formData.set("email", email.trim());

    const result = await subscribe(null, formData);

    if (!result.success) {
      const messages = Object.values(result.errors).flat();
      setError(messages[0] ?? "Could not subscribe. Please try again.");
      setStatus("idle");
      return;
    }

    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section className="py-14 md:py-20 bg-forest">
      <div className="container-tight">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="w-12 h-12 mx-auto mb-5 rounded-2xl bg-white/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 tracking-tight">
              {newsletter.badge}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-7">
              {newsletter.subtitle}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.06 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                type="email"
                placeholder={newsletter.placeholder}
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
              className="bg-gold text-white hover:bg-gold-hover rounded-full font-semibold h-12 px-6 text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "success" ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="flex items-center gap-1.5">
                  {newsletter.button} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </Button>
          </motion.form>

          {error && (
            <p className="text-red-200 text-xs mt-3" role="alert">
              {error}
            </p>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.12 }}
            className="text-white/25 text-[11px] mt-4"
          >
            {newsletter.disclaimer}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
