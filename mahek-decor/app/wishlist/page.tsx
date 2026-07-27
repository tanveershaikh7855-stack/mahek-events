import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/wishlist/wishlist-page-client";

export const metadata: Metadata = {
  title: "Wishlist | Mahek Decorator",
  description: "Your saved items. Keep track of your favorite balloons, bouquets, and party supplies.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}