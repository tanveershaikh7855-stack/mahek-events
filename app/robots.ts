import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private/functional routes out of the index.
        disallow: ["/api/", "/admin", "/account", "/checkout", "/cart"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
