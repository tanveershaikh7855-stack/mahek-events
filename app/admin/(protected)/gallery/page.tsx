import type { Metadata } from "next";
import { getAdminGallery } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = { title: "Gallery | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await getAdminGallery();

  const rows = images.map((g) => ({
    id: g.id,
    title: g.title,
    image: g.image,
    category: g.category,
    sortOrder: g.sortOrder,
    isActive: g.isActive,
  }));

  return (
    <PageShell title="Gallery">
      <GalleryManager images={rows} />
    </PageShell>
  );
}
