"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import {
  analyzeProductImage,
  analyzeServiceImage,
  type ProductSuggestion,
  type ServiceSuggestion,
} from "@/lib/ai/actions";

/**
 * Reusable "AI Fill" button that lives inside an admin form.
 * On click it:
 *   1. Finds the parent <form>
 *   2. Reads the current image value (a data URL) from the input named by `imageField`
 *   3. Sends it to Gemini via a server action
 *   4. Writes each returned field into the form's matching input
 *
 * Uses uncontrolled DOM writes (input.value = ...), which the surrounding admin
 * forms already support because they use defaultValue rather than controlled state.
 */

type FieldMap = Record<string, string | number | undefined>;

function fillForm(form: HTMLFormElement, values: FieldMap) {
  for (const [name, value] of Object.entries(values)) {
    if (value === undefined) continue;
    const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${name}"]`,
    );
    if (!el) continue;
    // Setting .value on React-uncontrolled inputs writes to the DOM directly;
    // FormData reads DOM values at submit time, so the change is picked up.
    el.value = String(value);
    // Dispatch input event so any controlled listeners also update.
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function readFirstImageDataUrl(form: HTMLFormElement, imageField: string): string | null {
  const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
    `[name="${imageField}"]`,
  );
  if (!el) return null;
  const raw = String(el.value ?? "");
  const first = raw.split("\n").map((s) => s.trim()).find(Boolean);
  if (!first) return null;
  if (!first.startsWith("data:")) return null;
  return first;
}

export function ProductAIFill({ imageField = "images" }: { imageField?: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle() {
    const form = btnRef.current?.closest("form");
    if (!form) return;
    const image = readFirstImageDataUrl(form, imageField);
    if (!image) {
      toast.error("Upload an image first so the AI can analyze it.");
      return;
    }
    setBusy(true);
    try {
      const res = await analyzeProductImage(image);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const s: ProductSuggestion = res.data;
      fillForm(form, {
        name: s.name,
        shortDesc: s.shortDesc,
        description: s.description,
      });
      toast.success(
        `AI filled: ${s.name}. Suggested category: ${s.suggestedCategory}. Tags: ${s.tags.join(", ")}`,
        { duration: 8000 },
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handle}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-forest-light text-forest px-3 py-1.5 text-xs font-semibold hover:bg-forest hover:text-white transition-colors disabled:opacity-60"
      title="Analyze the uploaded image with Gemini and auto-fill name, description, tags"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      {busy ? "AI reading photo…" : "AI Fill from image"}
    </button>
  );
}

export function ServiceAIFill({ imageField = "image" }: { imageField?: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle() {
    const form = btnRef.current?.closest("form");
    if (!form) return;
    const image = readFirstImageDataUrl(form, imageField);
    if (!image) {
      toast.error("Upload the main service photo first.");
      return;
    }
    setBusy(true);
    try {
      const res = await analyzeServiceImage(image);
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      const s: ServiceSuggestion = res.data;
      fillForm(form, {
        name: s.name,
        description: s.description,
        features: s.features.join("\n"),
        priceFrom: s.suggestedPriceFrom,
      });
      toast.success(`AI filled service: ${s.name} (from ₹${s.suggestedPriceFrom})`, {
        duration: 6000,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handle}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg bg-forest-light text-forest px-3 py-1.5 text-xs font-semibold hover:bg-forest hover:text-white transition-colors disabled:opacity-60"
      title="Analyze the uploaded image with Gemini and auto-fill service details"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      {busy ? "AI reading photo…" : "AI Fill from image"}
    </button>
  );
}
