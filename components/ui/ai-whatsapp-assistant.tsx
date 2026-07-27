"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_REPLIES = [
  "Shop balloons",
  "Book decoration",
  "Wedding packages",
  "Delivery info",
  "Talk to human",
];

const BOT_RESPONSES: Record<string, string> = {
  "balloon": "We offer premium helium balloon bunches, bouquets, and packets. Delivery within 140 KM from Mumbai with same-day service if ordered before 2 PM. Browse our collection at /shop.",
  "delivery": "We deliver within 140 KM radius of Mumbai. Free delivery on orders above ₹499 within 10 KM. Charges apply beyond that. What's your location?",
  "decoration": "We provide premium decoration services for birthdays, weddings, anniversaries, baby showers, corporate events, proposals, and more. Book online and our team will confirm via WhatsApp within 2 hours.",
  "wedding": "Our wedding decoration packages start at ₹14,999 including mandap, entrance, stage, and aisle decor. Custom themes available.",
  "birthday": "Birthday decoration starts at ₹2,499. Includes balloon arch, backdrop, signage, and setup + takedown.",
  "human": "Transferring you to a human agent. Our team will reach out on WhatsApp within 5 minutes during business hours (9 AM - 8 PM).",
  "price": "Product prices start from ₹399 for balloon packets, ₹699 for helium bunches. Decoration services from ₹2,499.",
  "order": "Order online via /shop. Add to cart, checkout with COD/UPI/Card. Same-day delivery available for orders before 2 PM.",
  "payment": "We accept Cash on Delivery, UPI, Credit/Debit cards, and wallets. 50% advance for decoration bookings.",
  "timing": "Mon-Sat 9 AM - 8 PM. Sunday by appointment. Delivery runs 10 AM - 7 PM daily.",
  "book": `BOOKING REQUEST\n\nWould you like to book with us? Please share:\n1. Product/Service name\n2. Event date\n3. Event type\n4. Delivery address\n\nOr visit /booking to start now!\n\nPhone: ${BRAND.phone}`,
  "material": `We offer premium decorative materials including balloons, flower stands, metal frames, LED numbers, lighting, and more. Visit /materials to browse all categories. Need help choosing? Just ask!`,
  "availability": `For real-time availability of materials and products, please WhatsApp us directly at ${BRAND.whatsapp}. We respond within 2 hours during business hours.\n\nOr visit /shop to see in-stock items.`,
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [keyword, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return "I can help with balloons, decorations, delivery, pricing, and bookings. What would you like to know?";
}

export function AIWhatsAppAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Mahek's AI assistant. I can help with balloons, decorations, delivery, and bookings. How can I assist?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sendMessage = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    const text = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getBotResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [input, isTyping]);

  const handleQuickReply = useCallback((text: string) => {
    setInput(text);
    setTimeout(() => {
      const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setTimeout(() => {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: getBotResponse(text),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, 800 + Math.random() * 600);
    }, 50);
  }, []);

  return (
    <>
      {/* FAB Button - positioned above bottom nav */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed z-50 w-12 h-12 rounded-full bg-forest text-white shadow-lg shadow-forest/20 flex items-center justify-center hover:bg-forest/90 transition-colors lg:hidden"
            style={{ bottom: "calc(64px + env(safe-area-inset-bottom, 0px) + 12px)", right: "18px" }}
            aria-label="Open AI Assistant"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Desktop FAB */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-forest text-white shadow-lg shadow-forest/20 hidden lg:flex items-center justify-center hover:bg-forest/90 transition-colors"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 md:inset-auto md:bottom-6 md:right-6 md:w-[360px] md:h-[480px] md:rounded-2xl bg-white md:shadow-2xl border border-border flex flex-col overflow-hidden md:border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-forest-light flex items-center justify-center">
                  <Bot className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">Mahek Assistant</p>
                  <p className="text-[10px] text-secondary-text">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 space-y-3" ref={scrollRef}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                      msg.role === "user"
                        ? "bg-forest text-white"
                        : "bg-forest-light text-forest"
                    )}
                  >
                    {msg.role === "user" ? (
                      <MessageCircle className="w-3 h-3" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[78%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed",
                      msg.role === "user"
                        ? "bg-forest text-white rounded-br-md"
                        : "bg-secondary text-ink rounded-bl-md"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={cn("text-[9px] mt-1 opacity-50", msg.role === "user" ? "text-white/70" : "text-secondary-text")}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-light flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-3 h-3 text-forest animate-spin" />
                  </div>
                  <div className="bg-secondary text-ink px-3 py-2 rounded-2xl rounded-bl-md text-[13px]">
                    <span className="flex gap-0.5">
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}>.</motion.span>
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}>.</motion.span>
                      <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}>.</motion.span>
                    </span>
                  </div>
                </motion.div>
              )}
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-border/50 flex-shrink-0">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="px-2.5 py-1 text-[11px] rounded-full border border-border bg-white hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-white flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 h-9 text-sm"
                  disabled={isTyping}
                />
                <Button onClick={sendMessage} disabled={!input.trim() || isTyping} size="icon" className="h-9 w-9 flex-shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-center text-[10px] text-secondary-text mt-1.5">
                Powered by AI &middot; <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`} target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">Chat on WhatsApp</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
