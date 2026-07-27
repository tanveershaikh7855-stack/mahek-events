"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "sonner";
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
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: { background: "#FAFAF8", border: "1px solid #ECECEC", color: "#111111" },
              }}
            />
            <SonnerToaster />
            <AIWhatsAppAssistant />
          </LenisProvider>
        </WishlistProvider>
      </CartProvider>
    </SessionProvider>
  );
}