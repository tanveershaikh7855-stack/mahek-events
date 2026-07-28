import type { Metadata } from "next";
import { ServicesPageClient } from "@/components/services/services-page-client";
import { servicesPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Premium Decoration Services | ${business.name}`,
  description: servicesPage.subtitle,
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}