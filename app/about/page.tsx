import type { Metadata } from "next";
import { AboutClient } from "@/components/about/about-client";
import { about, business, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Mahek Balloon — Premium Balloon Decorators in Pune Since 2015",
  description:
    "Mahek Balloon is Pune's trusted balloon decoration studio near Saras Baug. 11+ years of experience, 5000+ happy customers. Helium & nitrogen balloons for every celebration.",
  alternates: { canonical: "/about" },
  keywords: [
    "Mahek Balloon Pune",
    "balloon decorator Pune",
    "about Mahek Balloon",
    "balloon decoration studio Saras Baug",
  ],
  openGraph: {
    title: "About Mahek Balloon — Pune's Premium Balloon Decorators",
    description: about.description,
    url: "/about",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "About Mahek Balloon" }],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}