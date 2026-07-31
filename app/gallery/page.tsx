import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/gallery/gallery-page-client";
import { business } from "@/lib/content";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: `Gallery | ${business.name}`,
  description:
    "Browse our portfolio of balloon decorations, event styling, and celebration setups. See real projects for birthdays, weddings, proposals and more.",
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
