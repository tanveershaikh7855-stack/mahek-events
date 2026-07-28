import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/search-page-client";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Search | ${business.name}`,
  description: "Search for helium balloons, decorations, party supplies, and more.",
  robots: "noindex",
};

export default function SearchPage() {
  return <SearchPageClient />;
}