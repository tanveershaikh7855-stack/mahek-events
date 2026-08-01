import type { Metadata } from "next";
import { getAdminOffers, getAdminCategories } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { OffersManager } from "@/components/admin/offers-manager";

export const metadata: Metadata = { title: "Offers | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const [offers, categories] = await Promise.all([getAdminOffers(), getAdminCategories()]);

  const rows = offers.map((o) => ({
    id: o.id,
    title: o.title,
    slug: o.slug,
    badge: o.badge,
    subtitle: o.subtitle,
    description: o.description,
    image: o.image,
    discountLabel: o.discountLabel,
    couponCode: o.couponCode,
    ctaLabel: o.ctaLabel,
    ctaHref: o.ctaHref,
    categorySlug: o.categorySlug,
    startDate: o.startDate ? o.startDate.toISOString().slice(0, 10) : null,
    endDate: o.endDate ? o.endDate.toISOString().slice(0, 10) : null,
    isActive: o.isActive,
    sortOrder: o.sortOrder,
  }));

  const categoryOptions = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <PageShell title="Offers">
      <OffersManager offers={rows} categories={categoryOptions} />
    </PageShell>
  );
}
