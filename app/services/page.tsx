import type { Metadata } from "next";
import { ServicesPageClient } from "@/components/services/services-page-client";
import { servicesPage, business, seo } from "@/lib/content";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: "Balloon Decoration Services in Pune — Birthday, Wedding & Events",
  description:
    "Professional balloon decoration services in Pune — birthday, wedding, baby shower, corporate events, proposals & more. Premium helium & nitrogen decor. Setup within 70 KM of Saras Baug.",
  alternates: { canonical: "/services" },
  keywords: [
    "balloon decoration service Pune",
    "birthday decoration Pune",
    "wedding decoration Pune",
    "baby shower decoration Pune",
    "event decoration Pune",
    "helium balloon decoration service",
    "balloon decorator near me Pune",
  ],
  openGraph: {
    title: "Balloon Decoration Services in Pune | Mahek Balloon",
    description: servicesPage.subtitle,
    url: "/services",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloon Decoration Services" }],
  },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Services", href: "/services" }]} />
      <ServicesPageClient />
    </>
  );
}