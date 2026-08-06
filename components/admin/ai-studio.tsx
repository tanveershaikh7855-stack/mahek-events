"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Loader2,
  Bot,
  Package,
  Palette,
  Tag,
  Info,
  BarChart3,
  Wand2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { askAssistant } from "@/lib/ai/actions";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; text: string; actions?: string[] };

type Cap = {
  icon: typeof Package;
  title: string;
  blurb: string;
  example: string;
};

const CAPABILITIES: Cap[] = [
  {
    icon: Package,
    title: "Manage products",
    blurb: "Add, edit, hide, price, or delete products by describing them.",
    example: "Add a product: Chrome Gold Balloon Bouquet, ₹499, in Balloon Bouquets",
  },
  {
    icon: Palette,
    title: "Manage services",
    blurb: "Create or update decoration services with features and prices.",
    example: "Add a service: Baby Shower Setup, from ₹3500, with pastel balloon arch",
  },
  {
    icon: Tag,
    title: "Coupons & offers",
    blurb: "Spin up discount codes and promotional banners instantly.",
    example: "Create a coupon DIWALI20 for 20% off orders above ₹1000",
  },
  {
    icon: Info,
    title: "Edit the About page",
    blurb: "Change the story, stats, or years of experience in words.",
    example: "Change the years of experience on the About page to 30+",
  },
  {
    icon: BarChart3,
    title: "Answer questions",
    blurb: "Ask about today's orders, bookings, low stock, or customers.",
    example: "How many pending orders and new bookings do we have?",
  },
  {
    icon: Wand2,
    title: "Write copy",
    blurb: "Draft product descriptions, WhatsApp replies, SEO tags, emails.",
    example: "Write 3 warm product descriptions for chrome balloon bouquets",
  },
];

export function AIStudio() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean || pending) return;
    const next: Msg[] = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    inputRef.current?.focus();
    start(async () => {
      const res = await askAssistant(clean, messages);
      if (res.ok) {
        setMessages([
          ...next,
          { role: "assistant", text: res.data.reply, actions: res.data.actions },
        ]);
      } else {
        setMessages([...next, { role: "assistant", text: `⚠️ ${res.error}` }]);
      }
    });
  }

  const started = messages.length > 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      {/* Chat column */}
      <div className="flex flex-col rounded-2xl border border-border bg-white overflow-hidden min-h-[70vh]">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-forest to-forest/90 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold leading-tight">Mahek AI Assistant</p>
              <p className="text-[12px] text-white/75 leading-tight">
                Runs on your own server · free &amp; unlimited for commands
              </p>
            </div>
          </div>
          {started && (
            <button
              onClick={() => setMessages([])}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              New chat
            </button>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-secondary/30">
          {!started && (
            <div className="rounded-2xl bg-white border border-border p-5">
              <p className="text-sm font-medium text-ink mb-1">Hi 👋 I&apos;m your AI manager.</p>
              <p className="text-sm text-secondary-text leading-relaxed">
                Type a request in plain language and I&apos;ll do it — add a product, change a price,
                hide something, create a coupon, update the About page, or answer questions about
                today&apos;s shop. Commands run on your own server, so they&apos;re instant, free and
                never rate-limited. Anything permanent like deleting, I&apos;ll confirm with you
                first. Pick a card on the right to try one instantly.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} message={m} />
          ))}

          {pending && (
            <div className="flex items-center gap-2 text-xs text-secondary-text pl-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Working on it…
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-3 border-t border-border bg-white"
        >
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="e.g. Add a product: Rainbow Balloon Arch, ₹1299, in Balloon Bouquets"
              className="flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-forest max-h-40"
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="w-11 h-11 flex-shrink-0 rounded-xl bg-forest text-white flex items-center justify-center hover:bg-forest-hover disabled:opacity-40 transition-colors"
              aria-label="Send"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1.5 px-1 text-[11px] text-secondary-text">
            Press Enter to send · Shift+Enter for a new line
          </p>
        </form>
      </div>

      {/* Capability cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles className="w-4 h-4 text-forest" />
          What I can do
        </div>
        {CAPABILITIES.map((c) => (
          <button
            key={c.title}
            onClick={() => send(c.example)}
            disabled={pending}
            className="w-full text-left rounded-2xl border border-border bg-white p-4 hover:border-forest hover:shadow-sm transition-all disabled:opacity-60 group"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-forest-light flex items-center justify-center">
                <c.icon className="w-4 h-4 text-forest" />
              </div>
              <p className="text-sm font-semibold text-ink">{c.title}</p>
            </div>
            <p className="text-xs text-secondary-text leading-relaxed">{c.blurb}</p>
            <p className="mt-2 text-[11px] text-forest bg-forest-light/60 rounded-lg px-2 py-1.5 leading-snug group-hover:bg-forest-light">
              “{c.example}”
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message }: { message: Msg }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  function copy() {
    navigator.clipboard.writeText(message.text).then(
      () => {
        setCopied(true);
        toast.success("Copied");
        setTimeout(() => setCopied(false), 1500);
      },
      () => toast.error("Could not copy"),
    );
  }

  return (
    <div className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed",
          isUser
            ? "bg-forest text-white rounded-br-sm"
            : "bg-white border border-border text-ink rounded-bl-sm",
        )}
      >
        {message.text}

        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="mt-2.5 space-y-1">
            {message.actions.map((a, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-1.5 rounded-lg px-2 py-1 text-[11px]",
                  a.startsWith("⚠️") ? "bg-red-50 text-red-700" : "bg-forest-light text-forest",
                )}
              >
                {!a.startsWith("⚠️") && <Check className="w-3 h-3 mt-0.5 flex-shrink-0" />}
                <span>{a.replace(/^⚠️\s*/, "")}</span>
              </div>
            ))}
          </div>
        )}

        {!isUser && (
          <button
            onClick={copy}
            className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1 text-[11px] text-secondary-text hover:text-forest"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
