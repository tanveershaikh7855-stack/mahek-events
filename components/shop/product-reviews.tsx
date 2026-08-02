import { Star } from "lucide-react";
import { getProductReviews } from "@/lib/data";
import { ReviewForm } from "./review-form";
import { cn } from "@/lib/utils";

/**
 * Customer reviews block for the product page: approved reviews from the DB
 * plus a submission form. Server component so reviews render with the page.
 */
export async function ProductReviews({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const reviews = await getProductReviews(productId);
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="container-tight py-10 md:py-14 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-ink">
          Customer Reviews
          {avg && (
            <span className="ml-3 text-base font-normal text-secondary-text">
              {avg}★ · {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          )}
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-secondary-text">
              No reviews yet — be the first to review this product!
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink">{r.author}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "w-4 h-4",
                          n <= r.rating ? "text-gold fill-gold" : "text-border",
                        )}
                      />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-secondary-text mt-2 leading-relaxed">{r.comment}</p>
                )}
                <p className="text-xs text-secondary-text/70 mt-2">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))
          )}
        </div>

        <div>
          <ReviewForm productId={productId} slug={slug} />
        </div>
      </div>
    </section>
  );
}
