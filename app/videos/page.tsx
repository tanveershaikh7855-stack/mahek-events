import type { Metadata } from "next";
import { VideosPageClient } from "@/components/videos/videos-page-client";
import { getGalleryVideos } from "@/lib/data";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Videos | ${business.name}`,
  description:
    "Watch our balloon decoration setups and celebrations in motion — real events styled by Mahek Balloon.",
};

export const revalidate = 3600;

function safeSrc(src: string): string {
  const s = src.trim();
  if (s.startsWith("data:") || s.startsWith("http://") || s.startsWith("https://")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export default async function VideosPage() {
  const rows = await getGalleryVideos();
  const videos = rows
    .filter((v) => v.image && v.image.trim())
    .map((v) => ({
      id: v.id,
      src: safeSrc(v.image),
      title: v.title ?? "",
      category: v.category,
      poster: v.poster ? safeSrc(v.poster) : null,
    }));

  return <VideosPageClient videos={videos} />;
}
