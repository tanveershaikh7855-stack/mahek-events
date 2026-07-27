import type { Metadata } from "next";
import { TestimonialsClient } from "@/components/testimonials/testimonials-client";

export const metadata: Metadata = {
  title: "Testimonials | Mahek Decorator",
  description: "Read reviews from our happy customers across Mumbai. 5000+ satisfied customers for balloons and decoration services.",
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}