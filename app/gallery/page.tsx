import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/gallery/gallery-page-client";

export const metadata: Metadata = {
  title: "Gallery | Mahek Decorator",
  description:
    "Browse our portfolio of balloon decorations, event styling, and celebration setups. See real projects for birthdays, weddings, proposals and more.",
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}