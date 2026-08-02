"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2, ExternalLink } from "lucide-react";
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
  "Birthday Decoration",
  "Wedding Decoration",
  "Baby Shower",
  "Balloon Delivery",
  "Pricing",
  "Delivery Area",
  "Book Decoration",
  "Talk to Human",
];

const BOT_RESPONSES: Record<string, string> = {
  "balloon": "We offer premium helium balloon bunches, bouquets, and packets. Delivery within 70 KM from Pune with same-day service if ordered before 2 PM. Browse our collection at /shop.",
  "delivery": "We deliver within 70 KM radius of Pune. Free delivery on orders above ₹499 within 10 KM. Charges apply beyond that. What's your location?",
  "decoration": "We provide premium decoration services for birthdays, weddings, anniversaries, baby showers, corporate events, proposals, and more. Book online and our team will confirm via WhatsApp within 2 hours.",
  "wedding": "Our wedding decoration packages start at ₹14,999. Includes mandap, entrance, stage, and aisle decor. Custom themes available.",
  "birthday": "Birthday decoration starts at ₹2,499. Includes balloon arch, backdrop, signage, and setup + takedown.",
  "human": "I'll connect you with our team right away. You'll be redirected to WhatsApp where we can discuss your requirements personally.",
  "price": "Product prices start from ₹399 for balloon packets, ₹699 for helium bunches. Decoration services from ₹2,499.",
  "order": "Order online via /shop. Add to cart, checkout with COD/UPI/Card. Same-day delivery available for orders before 2 PM.",
  "payment": "We accept Cash on Delivery, UPI, Credit/Debit cards, and wallets. 50% advance for decoration bookings.",
  "timing": "Mon-Sat 9 AM - 8 PM. Sunday by appointment. Delivery runs 10 AM - 7 PM daily.",
  "book": "You can book online at /booking or call us directly. Share your event details and we'll create a custom package for you.\n\nPhone: +91 8087867988",
  "material": "We offer premium decorative materials including balloons, flower stands, metal frames, LED numbers, lighting, and more. Visit /materials to browse all categories.",
  "baby": "Baby shower decoration starts at ₹3,499. Soft pastel themes with balloon arches, welcome boards, and themed backdrops.",
  "area": "We cover Pune and surrounding areas up to 70 KM. Free delivery within 10 KM. Extra charges apply beyond that.",
};

function getBotResponse(input: string, history: string[]): string {
  const lower = input.toLowerCase();
  const matched = Object.entries(BOT_RESPONSES).find(([key]) => lower.includes(key));
  if (!matched) return "I can help with balloons, decorations, delivery, pricing, and bookings. What would you like to know?";
  if (history.includes(matched[1])) return "Is there anything else you'd like to know? I can also help with pricing, delivery, or booking.";
  return matched[1];
}

const WHATSAPP_MESSAGE = "Hello Mahek Balloon,%0A%0AI want to discuss my decoration requirements.";

function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export function AIWhatsAppAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Mahek's assistant. I can help with balloons, decorations, delivery, and bookings. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);
  const historyRef = useRef<string[]>([]);

  const isMobile = useWindowSize();

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Hide FAB on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY <= lastScrollY.current || currentY <= 100);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect keyboard open on mobile
  useEffect(() => {
    if (!isMobile) return;
    const handleResize = () => {
      setKeyboardOpen(window.innerHeight < window.outerHeight * 0.8);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const response = getBotResponse(text, historyRef.current);
      historyRef.current.push(response);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, [input, isTyping]);

  const handleQuickReply = useCallback((text: string) => {
    if (text === "Talk to Human") {
      window.open(`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${WHATSAPP_MESSAGE}`, "_blank");
      return;
    }
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const response = getBotResponse(text, historyRef.current);
      historyRef.current.push(response);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  }, []);

  const handleChatWithHuman = useCallback(() => {
    window.open(`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}?text=${WHATSAPP_MESSAGE}`, "_blank");
  }, []);

  return (
    <>
      {/* FAB - mobile */}
      <AnimatePresence>
        {isVisible && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 flex items-center justify-center hover:bg-[#20BD5A] transition-colors whatsapp-pulse",
              keyboardOpen ? "hidden" : "lg:hidden"
            )}
            style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px))", right: "16px" }}
            aria-label="Open AI Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB - desktop */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 hidden lg:flex items-center justify-center hover:bg-[#20BD5A] transition-colors whatsapp-pulse"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Overlay */}
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

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 bg-white flex flex-col overflow-hidden",
              "md:inset-auto md:bottom-6 md:right-6 md:w-[360px] md:h-[500px] md:rounded-2xl md:shadow-2xl md:border md:border-border"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-forest-light flex items-center justify-center">
                  <Bot className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">Mahek Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-green-600 font-medium">Online</span>
                  </div>
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
            <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex gap-2.5", msg.role === "user" && "flex-row-reverse")}
                  >
                    <div
                      className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        msg.role === "user" ? "bg-forest text-white" : "bg-forest-light text-forest"
                      )}
                    >
                      {msg.role === "user" ? (
                        <MessageCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Bot className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed",
                        msg.role === "user"
                          ? "bg-forest text-white rounded-br-md max-w-[80%]"
                          : "bg-secondary text-ink rounded-bl-md max-w-[85%]"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={cn("text-[9px] mt-1.5 opacity-50", msg.role === "user" ? "text-white/70" : "text-secondary-text")}>
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-forest-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Loader2 className="w-3.5 h-3.5 text-forest animate-spin" />
                    </div>
                    <div className="bg-secondary text-ink px-4 py-2.5 rounded-2xl rounded-bl-md text-[13px]">
                      <span className="flex gap-1">
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} className="inline-block">.</motion.span>
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }} className="inline-block">.</motion.span>
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }} className="inline-block">.</motion.span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick replies - horizontal scroll */}
            <div className="px-4 py-2 border-t border-border/50 flex-shrink-0">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="flex-shrink-0 px-3 py-1.5 text-[11px] font-medium rounded-full border border-border bg-white hover:bg-secondary hover:border-forest/20 transition-colors whitespace-nowrap"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat with Human button */}
            <div className="px-4 py-1.5 flex-shrink-0">
              <button
                onClick={handleChatWithHuman}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#25D366]/30 text-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Human
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </button>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-white flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 h-10 text-sm"
                  disabled={isTyping}
                />
                <Button onClick={sendMessage} disabled={!input.trim() || isTyping} size="icon" className="h-10 w-10 flex-shrink-0 rounded-xl">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
