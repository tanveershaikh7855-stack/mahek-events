import type { Metadata } from "next";
import { getAdminHeroSlides } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { HeroSlidesManager } from "@/components/admin/hero-slides-manager";

export const metadata: Metadata = {
  title: "Hero Slides | Mahek Admin",
  robots: "noindex",
};
export const dynamic = "force-dynamic";

export default async function HeroSlidesPage() {
  const rows = await getAdminHeroSlides();

  const slides = rows.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle,
    image: s.image,
    ctaLabel: s.ctaLabel,
    ctaHref: s.ctaHref,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
  }));

  return (
    <PageShell title="Hero Slides">
      <HeroSlidesManager slides={slides} />
    </PageShell>
  );
}
