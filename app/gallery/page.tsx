import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/gallery/gallery-page-client";
import { business, seo } from "@/lib/content";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Balloon Decoration Gallery — Real Events in Pune | Mahek Balloon",
  description:
    "See real balloon decoration setups by Mahek Balloon, Pune — birthdays, weddings, proposals, baby showers & corporate events. Premium helium balloon styling near Saras Baug.",
  alternates: { canonical: "/gallery" },
  keywords: [
    "balloon decoration photos Pune",
    "balloon decoration gallery",
    "event decoration portfolio Pune",
    "birthday decoration photos",
    "wedding decoration photos Pune",
  ],
  openGraph: {
    title: "Balloon Decoration Gallery | Mahek Balloon Pune",
    description: "Browse real balloon decoration projects — birthdays, weddings, proposals & more.",
    url: "/gallery",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloon Gallery" }],
  },
};

export const revalidate = 3600;

// next/image rejects a relative src without a leading slash; keep bad admin
// input from crashing the page.
function safeSrc(src: string): string {
  const s = src.trim();
  if (s.startsWith("data:") || s.startsWith("http://") || s.startsWith("https://")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export default async function GalleryPage() {
  const rows = await getGallery("all");
  const images = rows
    .filter((g) => g.image && g.image.trim())
    .map((g) => ({
      id: g.id,
      image: safeSrc(g.image),
      title: g.title ?? "",
      category: g.category,
      // Static fallback rows (from lib/content.ts) have no mediaType field.
      mediaType: ("mediaType" in g && g.mediaType === "VIDEO" ? "VIDEO" : "IMAGE") as
        | "IMAGE"
        | "VIDEO",
      poster: "poster" in g && g.poster ? safeSrc(g.poster) : null,
    }));
  return <GalleryPageClient images={images} />;
}
