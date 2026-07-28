"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { LenisProvider } from "@/components/ui/lenis-provider";
import { AIWhatsAppAssistant } from "@/components/ui/ai-whatsapp-assistant";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <WishlistProvider>
          <LenisProvider>
            {children}
            {/* One Toaster only. Two were mounted (`sonner` directly and the
                themed wrapper), so every toast rendered twice. */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: { background: "#FAFAF8", border: "1px solid #ECECEC", color: "#111111" },
              }}
            />
            <AIWhatsAppAssistant />
          </LenisProvider>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}