import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/search-page-client";

export const metadata: Metadata = {
  title: "Search | Mahek Decorator",
  description: "Search for helium balloons, decorations, party supplies, and more.",
  robots: "noindex",
};

export default function SearchPage() {
  return <SearchPageClient />;
}