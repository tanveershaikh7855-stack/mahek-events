import { seo } from "./content";

/**
 * Canonical origin for SEO output (metadata, sitemap, robots, JSON-LD).
 *
 * Prefers NEXT_PUBLIC_SITE_URL — on Vercel this is the URL the site is actually
 * reachable at, so search engines are pointed somewhere that resolves. Falls
 * back to the brand domain in content.ts for local dev. When the custom domain
 * is connected, updating that one env var moves every canonical URL with it.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || seo.siteUrl || "http://localhost:3000";
  // Strip a stray BOM/whitespace and any trailing slash.
  return raw.replace(/^﻿/, "").trim().replace(/\/+$/, "");
}
