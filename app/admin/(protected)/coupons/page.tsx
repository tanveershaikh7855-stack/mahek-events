import type { Metadata } from "next";
import { getCoupons } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { CouponsManager } from "@/components/admin/coupons-manager";

export const metadata: Metadata = { title: "Coupons | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await getCoupons();

  const rows = coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: Number(c.value),
    minOrder: c.minOrder ? Number(c.minOrder) : null,
    usageLimit: c.usageLimit,
    usageCount: c.usageCount,
    isActive: c.isActive,
  }));

  return (
    <PageShell title="Coupons">
      <CouponsManager coupons={rows} />
    </PageShell>
  );
}
