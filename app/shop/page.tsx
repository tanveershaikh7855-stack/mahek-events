import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { seo } from "@/lib/content";
import { getStoreProducts, getStoreProductCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop Premium Helium Balloons & Party Supplies",
  description: seo.metaDescription,
};

export const revalidate = 3600;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getStoreProducts(),
    getStoreProductCategories(),
  ]);
  return <ShopPageClient products={products} categories={categories} />;
}