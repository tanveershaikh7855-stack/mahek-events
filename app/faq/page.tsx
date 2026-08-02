import type { Metadata } from "next";
import { FaqPageClient } from "@/components/faq/faq-page-client";
import { faqPage, faqs, business, seo } from "@/lib/content";
import { FaqJsonLd } from "@/components/seo/faq-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: "FAQ — Helium Balloons, Delivery & Decoration in Pune | Mahek Balloons",
  description:
    "Frequently asked questions about Mahek Balloons — helium & nitrogen balloons, delivery within 70 KM, booking process, payment methods, and decoration services in Pune.",
  alternates: { canonical: "/faq" },
  keywords: [
    "Mahek Balloons FAQ",
    "helium balloon delivery Pune",
    "balloon decoration questions",
    "balloon shop Saras Baug",
  ],
  openGraph: {
    title: "FAQ | Mahek Balloons Pune",
    description: faqPage.subtitle,
    url: "/faq",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloons FAQ" }],
  },
};

export default function FaqPage() {
  return (
    <>
      <FaqJsonLd items={faqs} />
      <BreadcrumbJsonLd items={[{ name: "FAQ", href: "/faq" }]} />
      <FaqPageClient />
    </>
  );
}