import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/search-page-client";
import { business } from "@/lib/content";
import { getStoreProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: `Search | ${business.name}`,
  description: "Search for helium balloons, decorations, party supplies, and more.",
  robots: "noindex",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await getStoreProducts();
  return <SearchPageClient products={products} />;
}