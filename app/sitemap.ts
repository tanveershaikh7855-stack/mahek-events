import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getStoreProducts, getOffers } from "@/lib/data";
import { services } from "@/lib/content";

// Rebuilt hourly so newly published products/offers enter the sitemap without a
// redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "daily" },
    { path: "/shop", priority: 0.9, freq: "daily" },
    { path: "/flowers", priority: 0.9, freq: "daily" },
    { path: "/offers", priority: 0.9, freq: "daily" },
    { path: "/services", priority: 0.8, freq: "weekly" },
    { path: "/gallery", priority: 0.7, freq: "weekly" },
    { path: "/videos", priority: 0.6, freq: "weekly" },
    { path: "/booking", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.5, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
    { path: "/faq", priority: 0.5, freq: "monthly" },
    { path: "/testimonials", priority: 0.5, freq: "monthly" },
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((s) => ({
    url: `${base}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  // Dynamic content — degrade gracefully if the DB is briefly unreachable.
  try {
    const [products, offers] = await Promise.all([getStoreProducts(), getOffers()]);
    for (const p of products) {
      entries.push({
        url: `${base}/shop/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
    for (const o of offers) {
      entries.push({
        url: `${base}/offers/${o.slug}`,
        lastModified: o.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // static entries are enough on failure
  }

  for (const s of services) {
    entries.push({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
