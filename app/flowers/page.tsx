import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { seo } from "@/lib/content";
import { getStoreProducts, getStoreProductCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Flower Bouquets in Pune — Fresh Roses & Seasonal Blooms | Mahek Balloons",
  description:
    "Order fresh flower bouquets in Pune — roses, seasonal blooms & preserved arrangements. Same-day pickup from Saras Baug. Perfect for birthdays, anniversaries & weddings.",
  alternates: { canonical: "/flowers" },
  keywords: [
    "flower bouquets Pune",
    "buy flowers Pune",
    "rose bouquet Pune",
    "fresh flower delivery Pune",
    "flower shop Saras Baug",
  ],
  openGraph: {
    title: "Flower Bouquets in Pune | Mahek Balloons",
    description: "Fresh & handcrafted flower bouquets for every celebration. Same-day pickup in Pune.",
    url: "/flowers",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloons Flower Bouquets" }],
  },
};

export const revalidate = 3600;

export default async function FlowersPage() {
  const [flowers, categories] = await Promise.all([
    getStoreProducts({ categorySlug: "flower-bouquets" }),
    getStoreProductCategories(),
  ]);

  // Only flower categories so the in-page filter stays on-topic.
  const flowerCategories = categories.filter((c) => c.slug === "flower-bouquets");
  const light = flowers.map((p) => ({ ...p, description: "" }));

  return (
    <ShopPageClient
      products={light}
      categories={flowerCategories}
      heading="Flower Bouquets"
      blurb={`${flowers.length} ${flowers.length === 1 ? "bouquet" : "bouquets"} — fresh & handcrafted`}
    />
  );
}
