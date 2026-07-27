import type { Metadata } from "next";
import { ServicesPageClient } from "@/components/services/services-page-client";

export const metadata: Metadata = {
  title: "Premium Decoration Services | Mahek Decorator",
  description:
    "Professional event decoration services for birthdays, weddings, anniversaries, corporate events, baby showers, and more in Mumbai.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}