import type { Metadata } from "next";
import { getAdminReviewVideos } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { ReviewVideosManager } from "@/components/admin/review-videos-manager";

export const metadata: Metadata = {
  title: "Review Videos | Mahek Admin",
  robots: "noindex",
};
export const dynamic = "force-dynamic";

export default async function ReviewVideosPage() {
  const rows = await getAdminReviewVideos();

  const reviews = rows.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    eventType: r.eventType,
    rating: r.rating,
    reviewText: r.reviewText,
    videoUrl: r.videoUrl,
    poster: r.poster,
    duration: r.duration,
    isFeatured: r.isFeatured,
    isActive: r.isActive,
    sortOrder: r.sortOrder,
  }));

  return (
    <PageShell title="Review Videos">
      <ReviewVideosManager reviews={reviews} />
    </PageShell>
  );
}
