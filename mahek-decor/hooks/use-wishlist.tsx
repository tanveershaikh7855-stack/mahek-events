"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";

const WISHLIST_STORAGE_KEY = "mahekdecor_wishlist";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  addedAt: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.productId === item.productId);
      if (exists) {
        toast.info("Removed from wishlist");
        return prev.filter((i) => i.productId !== item.productId);
      }
      toast.success("Added to wishlist");
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    toast.info("Removed from wishlist");
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some((i) => i.productId === productId);
  }, [items]);

  return (
    <WishlistContext.Provider
      value={{ items, toggleItem, removeItem, clearWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}