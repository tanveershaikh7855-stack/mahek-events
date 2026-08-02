import type { Metadata } from "next";
import { getAdminServices } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { ServicesManager } from "@/components/admin/services-manager";

export const metadata: Metadata = { title: "Services | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await getAdminServices();

  const rows = services.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    priceFrom: Number(s.priceFrom),
    image: s.image,
    features: Array.isArray(s.features) ? (s.features as string[]) : [],
    sortOrder: s.sortOrder,
    isActive: s.isActive,
  }));

  return (
    <PageShell title="Services">
      <ServicesManager services={rows} />
    </PageShell>
  );
}
