"use client";

import { useState } from "react";
import { Copy, Check, Tag } from "lucide-react";

/** Shows an offer's coupon code with a one-tap copy button. */
export function CopyCoupon({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — the code is still visible to type manually.
    }
  };

  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-forest/40 bg-forest-light px-4 py-3">
      <Tag className="w-5 h-5 text-forest" />
      <div>
        <p className="text-[11px] uppercase tracking-wide text-secondary-text">Use code</p>
        <p className="font-mono text-lg font-bold text-forest tracking-wider">{code}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-forest px-3 py-2 text-xs font-semibold text-white hover:bg-forest-hover"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
