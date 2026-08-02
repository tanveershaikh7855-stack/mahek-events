import type { Metadata } from "next";
import { getReviews } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { ReviewsTable } from "@/components/admin/reviews-table";

export const metadata: Metadata = { title: "Reviews | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const rows = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isVerified: r.isVerified,
    productName: r.product.name,
    customerName: r.customer?.name ?? r.authorName ?? null,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <PageShell title="Reviews">
      <ReviewsTable reviews={rows} />
    </PageShell>
  );
}
