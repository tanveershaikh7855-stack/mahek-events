import type { Metadata } from "next";
import { FaqPageClient } from "@/components/faq/faq-page-client";

export const metadata: Metadata = {
  title: "FAQ | Mahek Decorator",
  description: "Frequently asked questions about helium balloons, decoration services, delivery, pricing, and bookings.",
};

export default function FaqPage() {
  return <FaqPageClient />;
}