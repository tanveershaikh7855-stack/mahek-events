import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/wishlist/wishlist-page-client";
import { wishlistPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `${wishlistPage.title} | ${business.name}`,
  description: wishlistPage.emptyDescription,
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}