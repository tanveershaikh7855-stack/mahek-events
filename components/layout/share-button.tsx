"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

/**
 * Share the site. Uses the native share sheet on phones (navigator.share) and
 * falls back to copying the link to the clipboard on desktop.
 */
export function ShareButton({
  className,
  label = "Share",
  url = "https://mahekballoons.com",
}: {
  className?: string;
  label?: string;
  url?: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const shareData = {
      title: "Mahek Balloons — Premium Balloon Decoration in Pune",
      text: "Check out Mahek Balloons for helium balloons, bouquets & event decoration in Pune!",
      url,
    };
    // navigator.share only exists on secure contexts / supporting browsers.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User dismissed the sheet — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied — share it anywhere!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={
        className ??
        "flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors duration-200"
      }
      aria-label="Share Mahek Balloons"
    >
      {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
      {label}
    </button>
  );
}
