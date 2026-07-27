import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop/shop-page-client";

export const metadata: Metadata = {
  title: "Shop Premium Helium Balloons & Party Supplies",
  description:
    "Browse our curated collection of helium balloons, balloon bouquets, flower arrangements, and party supplies. Same-day delivery within 140 KM.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}