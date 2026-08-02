"use client";

import { useState, useTransition } from "react";
import { Star, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/lib/actions";
import { cn } from "@/lib/utils";

/**
 * Public review form on the product page. Submits an unverified review that
 * appears once an admin approves it in Admin → Reviews.
 */
export function ReviewForm({ productId, slug }: { productId: string; slug: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-emerald-800">
          Thanks for your review! It will appear here once our team approves it.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) =>
        start(async () => {
          formData.set("productId", productId);
          formData.set("slug", slug);
          formData.set("rating", String(rating));
          const res = await submitReview(null, formData);
          if (res.success) {
            setDone(true);
          } else {
            const msg = Object.values(res.errors).flat()[0];
            toast.error(msg ?? "Could not submit your review.");
          }
        })
      }
      className="rounded-2xl border border-border bg-white p-4 space-y-3"
    >
      <h4 className="font-semibold text-ink">Write a review</h4>

      <div>
        <Label className="text-sm">Your rating *</Label>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  (hover || rating) >= n ? "text-gold fill-gold" : "text-border",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="review-name" className="text-sm">Your name *</Label>
        <Input id="review-name" name="name" placeholder="e.g. Priya S." required className="mt-1" />
      </div>

      <div>
        <Label htmlFor="review-comment" className="text-sm">Your review</Label>
        <textarea
          id="review-comment"
          name="comment"
          rows={3}
          placeholder="Tell others about your experience…"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={pending || rating === 0}
        className="bg-forest text-white hover:bg-forest/90 rounded-xl"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        Submit review
      </Button>
    </form>
  );
}
