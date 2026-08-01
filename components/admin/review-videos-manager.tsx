"use client";

import { useMemo, useState, useTransition } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { toast } from "sonner";
import {
  Video as VideoIcon,
  Plus,
  Pencil,
  Loader2,
  Star,
  GripVertical,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  saveReviewVideo,
  deleteReviewVideo,
  toggleReviewVideoActive,
  toggleReviewVideoFeatured,
  reorderReviewVideos,
} from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { ImageUploader } from "./shared/image-uploader";
import { cn } from "@/lib/utils";

export type ReviewVideoRow = {
  id: string;
  customerName: string;
  eventType: string;
  rating: number;
  reviewText: string | null;
  videoUrl: string;
  poster: string | null;
  duration: number | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

const EVENT_TYPES = [
  { value: "birthday", label: "Birthday" },
  { value: "wedding", label: "Wedding" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "anniversary", label: "Anniversary" },
  { value: "corporate", label: "Corporate" },
  { value: "proposal", label: "Proposal" },
  { value: "festival", label: "Festival" },
  { value: "other", label: "Other" },
];

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function StarPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: number;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={value} />
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setValue(n)}
          className="p-0.5"
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              n <= value ? "text-gold fill-gold" : "text-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewDialog({
  review,
  open,
  onOpenChange,
}: {
  review: ReviewVideoRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{review ? "Edit review video" : "Add review video"}</DialogTitle>
          <DialogDescription>
            Upload a customer video and the details customers see under it.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveReviewVideo(review?.id ?? null, formData);
              if (res.ok) {
                toast.success(res.message ?? "Saved");
                onOpenChange(false);
              } else {
                toast.error(res.error);
              }
            })
          }
          className="space-y-4"
        >
          <ImageUploader
            name="videoUrl"
            label="Video *"
            defaultValue={review?.videoUrl ? [review.videoUrl] : []}
            defaultKind="video"
            multiple={false}
            allowVideo
          />

          <ImageUploader
            name="poster"
            label="Poster / cover image (optional)"
            defaultValue={review?.poster ? [review.poster] : []}
            multiple={false}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Customer name *</label>
              <input
                name="customerName"
                defaultValue={review?.customerName ?? ""}
                required
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Event type *</label>
              <select
                name="eventType"
                defaultValue={review?.eventType ?? "birthday"}
                className={field}
              >
                {EVENT_TYPES.map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Rating</label>
            <StarPicker name="rating" defaultValue={review?.rating ?? 5} />
          </div>

          <div>
            <label className={labelCls}>Review text</label>
            <textarea
              name="reviewText"
              rows={3}
              defaultValue={review?.reviewText ?? ""}
              className={cn(field, "resize-none")}
              placeholder="What did the customer say about the decor?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Duration (seconds)</label>
              <input
                name="duration"
                type="number"
                min={0}
                defaultValue={review?.duration ?? ""}
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Sort order</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={review?.sortOrder ?? 0}
                className={field}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={review?.isActive ?? true}
                className="rounded border-border"
              />
              Show on site
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={review?.isFeatured ?? false}
                className="rounded border-border"
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-60"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              {review ? "Save changes" : "Add review"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ActiveToggle({ review }: { review: ReviewVideoRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleReviewVideoActive(review.id, !review.isActive);
          if (res.ok) toast.success(res.message ?? "Updated");
          else toast.error(res.error);
        })
      }
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors disabled:opacity-60",
        review.isActive
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {pending ? "…" : review.isActive ? "Live" : "Hidden"}
    </button>
  );
}

function FeaturedToggle({ review }: { review: ReviewVideoRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleReviewVideoFeatured(review.id, !review.isFeatured);
          if (res.ok) toast.success(res.message ?? "Updated");
          else toast.error(res.error);
        })
      }
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors disabled:opacity-60",
        review.isFeatured
          ? "bg-gold/15 text-gold border-gold/30"
          : "bg-gray-100 text-gray-600 border-gray-200",
      )}
      aria-label={review.isFeatured ? "Unfeature" : "Feature"}
    >
      <Sparkles className="w-3 h-3" />
      {review.isFeatured ? "Featured" : "Feature"}
    </button>
  );
}

function ReviewRow({
  review,
  onEdit,
}: {
  review: ReviewVideoRow;
  onEdit: (r: ReviewVideoRow) => void;
}) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={review}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3"
    >
      <button
        type="button"
        onPointerDown={(e) => dragControls.start(e)}
        className="p-1 cursor-grab active:cursor-grabbing text-secondary-text hover:text-ink touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        {review.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.poster}
            alt={review.customerName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <VideoIcon className="w-5 h-5 text-secondary-text" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{review.customerName}</p>
        <p className="text-xs text-secondary-text capitalize">
          {review.eventType.replace(/-/g, " ")} · {review.rating}★
        </p>
      </div>

      <div className="flex items-center gap-2">
        <FeaturedToggle review={review} />
        <ActiveToggle review={review} />
        <button
          type="button"
          onClick={() => onEdit(review)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Edit"
        >
          <Pencil className="w-4 h-4 text-secondary-text" />
        </button>
        <ConfirmDelete
          title={`Delete review from "${review.customerName}"?`}
          description="This removes the video and review permanently."
          onConfirm={() => deleteReviewVideo(review.id)}
        />
      </div>
    </Reorder.Item>
  );
}

export function ReviewVideosManager({ reviews }: { reviews: ReviewVideoRow[] }) {
  const [editing, setEditing] = useState<ReviewVideoRow | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [order, setOrder] = useState<ReviewVideoRow[]>(reviews);
  const [savingOrder, saveOrder] = useTransition();

  const filtered = useMemo(() => {
    if (filter === "all") return order;
    if (filter === "featured") return order.filter((r) => r.isFeatured);
    if (filter === "hidden") return order.filter((r) => !r.isActive);
    return order.filter((r) => r.eventType === filter);
  }, [order, filter]);

  const persistOrder = (next: ReviewVideoRow[]) => {
    setOrder(next);
    // Only persist when we're on "all" — otherwise a partial view would shuffle
    // ranks in confusing ways.
    if (filter !== "all") return;
    saveOrder(async () => {
      const res = await reorderReviewVideos(next.map((r) => r.id));
      if (!res.ok) toast.error(res.error);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { v: "all", l: `All (${reviews.length})` },
            { v: "featured", l: `Featured (${reviews.filter((r) => r.isFeatured).length})` },
            { v: "hidden", l: `Hidden (${reviews.filter((r) => !r.isActive).length})` },
            ...EVENT_TYPES.map((e) => ({
              v: e.value,
              l: e.label,
            })).filter((e) => reviews.some((r) => r.eventType === e.v)),
          ].map((chip) => (
            <button
              key={chip.v}
              type="button"
              onClick={() => setFilter(chip.v)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === chip.v
                  ? "bg-forest text-white"
                  : "bg-secondary text-secondary-text hover:bg-border",
              )}
            >
              {chip.l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {savingOrder && (
            <span className="inline-flex items-center gap-1 text-xs text-secondary-text">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving order…
            </span>
          )}
          <button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
          >
            <Plus className="w-4 h-4" />
            Add review
          </button>
        </div>
      </div>

      {filter === "all" && reviews.length > 1 && (
        <p className="text-[11px] text-secondary-text">
          Drag the ⋮ handle to reorder. Order saves automatically.
        </p>
      )}

      {reviews.length === 0 ? (
        <EmptyState
          icon={VideoIcon}
          title="No review videos yet"
          hint="Add your first customer video review."
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={VideoIcon} title="No matches" hint="Try a different filter." />
      ) : (
        <Reorder.Group
          axis="y"
          values={filtered}
          onReorder={persistOrder}
          className="space-y-2"
        >
          {filtered.map((review) => (
            <ReviewRow key={review.id} review={review} onEdit={(r) => { setEditing(r); setOpen(true); }} />
          ))}
        </Reorder.Group>
      )}

      <ReviewDialog
        key={editing?.id ?? "new-review"}
        review={editing}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
