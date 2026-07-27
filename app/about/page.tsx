import type { Metadata } from "next";
import { AboutClient } from "@/components/about/about-client";

export const metadata: Metadata = {
  title: "About Us | Mahek Decorator",
  description: "Learn about Mahek Decorator - our story, mission, and dedication to creating beautiful celebrations with premium helium balloons and decoration services.",
};

export default function AboutPage() {
  return <AboutClient />;
}