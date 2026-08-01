import type { MetadataRoute } from "next";
import { business, seo } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.metaTitle,
    short_name: business.name,
    description: seo.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",
    theme_color: "#184E3B",
    icons: [
      { src: "/images/logo/logo.png", sizes: "any", type: "image/png" },
      { src: "/images/logo/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
