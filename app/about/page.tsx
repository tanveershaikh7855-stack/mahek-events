import type { Metadata } from "next";
import { AboutClient } from "@/components/about/about-client";
import { about, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `About Us | ${business.name}`,
  description: about.description,
};

export default function AboutPage() {
  return <AboutClient />;
}