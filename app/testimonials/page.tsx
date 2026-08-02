import type { Metadata } from "next";
import { TestimonialsClient } from "@/components/testimonials/testimonials-client";
import { testimonialsPage, business, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Customer Reviews & Testimonials — Mahek Balloons Pune",
  description:
    "Read 5000+ customer reviews for Mahek Balloons, Pune. Trusted for premium helium balloon decoration, birthday setups, wedding decor & event styling near Saras Baug.",
  alternates: { canonical: "/testimonials" },
  keywords: [
    "Mahek Balloons reviews",
    "balloon decoration reviews Pune",
    "balloon shop reviews Saras Baug",
    "event decoration testimonials",
  ],
  openGraph: {
    title: "Customer Reviews | Mahek Balloons Pune",
    description: testimonialsPage.subtitle,
    url: "/testimonials",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloons Reviews" }],
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}