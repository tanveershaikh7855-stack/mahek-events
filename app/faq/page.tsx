import type { Metadata } from "next";
import { FaqPageClient } from "@/components/faq/faq-page-client";
import { faqPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `FAQ | ${business.name}`,
  description: faqPage.subtitle,
};

export default function FaqPage() {
  return <FaqPageClient />;
}