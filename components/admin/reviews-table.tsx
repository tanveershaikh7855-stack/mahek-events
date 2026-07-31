"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Star, Check, Undo2 } from "lucide-react";
import { setReviewVerified, deleteReview } from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { formatDate, cn } from "@/lib/utils";

export type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  productName: string;
  customerName: string | null;
  createdAt: string;
};

function VerifyButton({ review }: { review: ReviewRow }) {
  const [pending, start] = useTransition();
  const next = !review.isVerified;

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await setReviewVerified(review.id, next);
          if (res.ok) toast.success(res.message ?? "Updated");
          else toast.error(res.error);
        })
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
        next
          ? "border-green-200 text-green-700 hover:bg-green-50"
          : "border-border text-secondary-text hover:bg-secondary",
      )}
    >
      {next ? <Check className="w-3.5 h-3.5" /> : <Undo2 className="w-3.5 h-3.5" />}
      {next ? "Approve" : "Unapprove"}
    </button>
  );
}

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");

  const filtered = reviews.filter((r) => {
    if (filter === "PENDING") return !r.isVerified;
    if (filter === "APPROVED") return r.isVerified;
    return true;
  });

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        hint="Customer reviews appear here for approval before showing on the storefront."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {(["ALL", "PENDING", "APPROVED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors",
              filter === f
                ? "bg-forest text-white border-forest"
                : "bg-white text-secondary-text border-border hover:text-ink",
            )}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3.5 h-3.5",
                          i < r.rating ? "text-gold fill-gold" : "text-border",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-ink">
                    {r.customerName || "Anonymous"}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium border",
                      r.isVerified
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200",
                    )}
                  >
                    {r.isVerified ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-xs text-secondary-text mt-1">
                  on {r.productName} · {formatDate(r.createdAt)}
                </p>
                {r.title && <p className="text-sm font-medium text-ink mt-2">{r.title}</p>}
                {r.comment && (
                  <p className="text-sm text-secondary-text mt-1 leading-relaxed">{r.comment}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <VerifyButton review={r} />
                <ConfirmDelete
                  title="Delete this review?"
                  onConfirm={() => deleteReview(r.id)}
                />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-secondary-text text-center py-8">
            No {filter.toLowerCase()} reviews.
          </p>
        )}
      </div>
    </div>
  );
}
