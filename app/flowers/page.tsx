import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { getStoreProducts, getStoreProductCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Flower Bouquets | Mahek Balloon",
  description:
    "Fresh and handcrafted flower bouquets for birthdays, anniversaries, weddings and every celebration. Same-day delivery in Pune.",
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
