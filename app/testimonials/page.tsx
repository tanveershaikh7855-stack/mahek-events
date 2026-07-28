import type { Metadata } from "next";
import { TestimonialsClient } from "@/components/testimonials/testimonials-client";
import { testimonialsPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Testimonials | ${business.name}`,
  description: testimonialsPage.subtitle,
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}