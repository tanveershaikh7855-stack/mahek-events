import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { seo, business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shop Premium Helium Balloons & Party Supplies",
  description: seo.metaDescription,
};

export default function ShopPage() {
  return <ShopPageClient />;
}