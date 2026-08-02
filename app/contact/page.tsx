import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/contact-page-client";
import { contactPage, business, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Mahek Balloons — Balloon Shop Near Saras Baug, Pune",
  description:
    "Get in touch with Mahek Balloons, Pune. Visit us opposite Saras Baug Garden or call +91 8087867988. Open Mon–Sat 9 AM–8 PM. WhatsApp available.",
  alternates: { canonical: "/contact" },
  keywords: [
    "Mahek Balloons contact",
    "balloon shop Saras Baug Pune",
    "balloon shop phone number Pune",
    "balloon decorator contact Pune",
  ],
  openGraph: {
    title: "Contact Mahek Balloons — Saras Baug, Pune",
    description: contactPage.subtitle,
    url: "/contact",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Contact Mahek Balloons" }],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}