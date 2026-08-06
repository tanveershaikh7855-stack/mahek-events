"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Sparkles, Send, X, Copy, Check, Loader2, Bot } from "lucide-react";
import { toast } from "sonner";
import { askAssistant } from "@/lib/ai/actions";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; text: string; actions?: string[] };

const STARTERS = [
  "Add a product: Chrome Gold Balloon Bouquet, ₹499, in Balloon Bouquets",
  "Create a coupon DIWALI20 for 20% off orders above ₹1000",
  "Change the years of experience on the About page to 30+",
  "Write 3 product descriptions for chrome balloon bouquets",
  "How many pending orders do we have right now?",
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  function send(text: string) {
    const clean = text.trim();
    if (!clean) return;
    const next: Msg[] = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    start(async () => {
      const res = await askAssistant(clean, messages);
      if (res.ok) {
        setMessages([
          ...next,
          { role: "assistant", text: res.data.reply, actions: res.data.actions },
        ]);
      } else {
        setMessages([
          ...next,
          { role: "assistant", text: `⚠️ ${res.error}` },
        ]);
      }
    });
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-forest text-white pl-3 pr-4 py-3 shadow-xl hover:bg-forest-hover transition-all group"
          aria-label="Open AI assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold animate-pulse" />
          </div>
          <span className="text-sm font-semibold">AI Assistant</span>
        </button>
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl border-l border-border transform transition-transform duration-300 flex flex-col",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-forest to-forest/90 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Mahek AI Assistant</p>
              <p className="text-[11px] text-white/70 leading-tight">
                Powered by Gemini · can make changes for you
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-white border border-border p-4">
                <p className="text-sm text-ink font-medium mb-1">Hi 👋 I&apos;m your AI assistant.</p>
                <p className="text-xs text-secondary-text leading-relaxed">
                  I can actually make changes for you — add or edit products and services, set
                  prices, create coupons and offers, update the About page — plus draft copy and
                  answer questions about today&apos;s orders. Just tell me what you want. I&apos;ll
                  confirm before anything permanent like deleting.
                </p>
              </div>
              <div>
                <p className="text-[11px] text-secondary-text uppercase tracking-wide mb-2 px-1">
                  Try one of these
                </p>
                <div className="space-y-1.5">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full text-left text-xs text-ink bg-white hover:bg-forest-light hover:text-forest border border-border rounded-xl px-3 py-2 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}

          {pending && (
            <div className="flex items-center gap-2 text-xs text-secondary-text pl-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              AI is thinking…
            </div>
          )}
        </div>

        {/* Input */}
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
              placeholder="Ask anything, or describe what you want written…"
              className="flex-1 resize-none rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest max-h-32"
              disabled={pending}
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-forest text-white flex items-center justify-center hover:bg-forest-hover disabled:opacity-40 transition-colors"
              aria-label="Send"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="mt-2 text-[11px] text-secondary-text hover:text-ink"
            >
              Clear conversation
            </button>
          )}
        </form>
      </div>
    </>
  );
}

function MessageBubble({ message }: { message: Msg }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  function copy() {
    navigator.clipboard.writeText(message.text).then(
      () => {
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 1500);
      },
      () => toast.error("Could not copy"),
    );
  }

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed",
          isUser
            ? "bg-forest text-white rounded-br-sm"
            : "bg-white border border-border text-ink rounded-bl-sm",
        )}
      >
        {message.text}
        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.actions.map((a, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-1.5 rounded-lg px-2 py-1 text-[11px]",
                  a.startsWith("⚠️")
                    ? "bg-red-50 text-red-700"
                    : "bg-forest-light text-forest",
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
            {copied ? "Copied" : "Copy reply"}
          </button>
        )}
      </div>
    </div>
  );
}
