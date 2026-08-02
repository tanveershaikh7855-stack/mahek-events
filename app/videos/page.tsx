import type { Metadata } from "next";
import { VideosPageClient } from "@/components/videos/videos-page-client";
import { getGalleryVideos } from "@/lib/data";
import { business, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Balloon Decoration Videos — Real Events in Pune | Mahek Balloons",
  description:
    "Watch real balloon decoration videos by Mahek Balloons, Pune — birthday setups, wedding decor, proposals & event styling. See our work in action.",
  alternates: { canonical: "/videos" },
  keywords: [
    "balloon decoration videos Pune",
    "event decoration videos",
    "birthday decoration video",
    "wedding balloon decoration video",
  ],
  openGraph: {
    title: "Decoration Videos | Mahek Balloons Pune",
    description: "Real balloon decoration setups and celebrations styled by Mahek Balloons.",
    url: "/videos",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloons Videos" }],
  },
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
