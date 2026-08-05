"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Loader2, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { saveHeroSlide, deleteHeroSlide, toggleHeroSlideActive } from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { ImageUploader } from "./shared/image-uploader";
import { cn } from "@/lib/utils";

export type HeroSlideRow = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  sortOrder: number;
  isActive: boolean;
};

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function SlideForm({
  slide,
  onDone,
}: {
  slide: HeroSlideRow | null;
  onDone: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveHeroSlide(slide?.id ?? null, fd);
      if (res.ok) {
        toast.success(res.message);
        onDone();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      <div>
        <label className={labelCls}>Slide Image *</label>
        <ImageUploader name="image" defaultValue={slide?.image ?? ""} />
      </div>
      <div>
        <label className={labelCls}>Title *</label>
        <input name="title" className={field} defaultValue={slide?.title ?? ""} placeholder="e.g. Magical Balloon Setups" required />
      </div>
      <div>
        <label className={labelCls}>Subtitle *</label>
        <textarea name="subtitle" className={cn(field, "resize-none")} rows={2} defaultValue={slide?.subtitle ?? ""} placeholder="e.g. Perfect for birthdays, weddings & more" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Button Label</label>
          <input name="ctaLabel" className={field} defaultValue={slide?.ctaLabel ?? ""} placeholder="Book Now" />
        </div>
        <div>
          <label className={labelCls}>Button Link</label>
          <input name="ctaHref" className={field} defaultValue={slide?.ctaHref ?? ""} placeholder="/book" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Sort Order</label>
          <input name="sortOrder" type="number" className={field} defaultValue={slide?.sortOrder ?? 0} />
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" value="on" defaultChecked={slide?.isActive ?? true} className="w-4 h-4 accent-forest" />
            <span className="text-sm font-medium text-ink">Active (visible)</span>
          </label>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-forest text-white text-sm font-medium py-2.5 hover:bg-forest/90 disabled:opacity-60 transition-colors"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {slide ? "Save Changes" : "Add Slide"}
        </button>
        <button type="button" onClick={onDone} className="px-4 rounded-xl border border-border text-sm font-medium text-ink hover:bg-surface transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function HeroSlidesManager({ slides: initial }: { slides: HeroSlideRow[] }) {
  const [slides] = useState(initial);
  const [editing, setEditing] = useState<HeroSlideRow | null | "new">(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(slide: HeroSlideRow) {
    setTogglingId(slide.id);
    startTransition(async () => {
      const res = await toggleHeroSlideActive(slide.id, !slide.isActive);
      if (res.ok) toast.success(res.message);
      else toast.error(res.message);
      setTogglingId(null);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteHeroSlide(id);
      if (res.ok) toast.success(res.message);
      else toast.error(res.message);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-text">
          {slides.length} slide{slides.length !== 1 ? "s" : ""} — changes appear on the homepage immediately.
        </p>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest text-white text-sm font-medium hover:bg-forest/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {slides.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No slides yet" description="Add your first hero carousel slide." />
      ) : (
        <div className="space-y-3">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border bg-white transition-opacity",
                !slide.isActive && "opacity-60"
              )}
            >
              <GripVertical className="w-4 h-4 text-secondary-text shrink-0" />

              {/* Thumbnail */}
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface shrink-0 border border-border">
                {slide.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-secondary-text" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{slide.title}</p>
                <p className="text-xs text-secondary-text truncate">{slide.subtitle}</p>
                {slide.ctaLabel && (
                  <span className="text-[10px] text-forest font-medium">CTA: {slide.ctaLabel}</span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(slide)}
                  disabled={togglingId === slide.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-forest hover:bg-forest/5 transition-colors disabled:opacity-50"
                  title={slide.isActive ? "Hide slide" : "Show slide"}
                >
                  {togglingId === slide.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : slide.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setEditing(slide)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-forest hover:bg-forest/5 transition-colors"
                  title="Edit slide"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingId(slide.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Add Hero Slide" : "Edit Slide"}</DialogTitle>
            <DialogDescription>
              Changes appear on the homepage as soon as you save.
            </DialogDescription>
          </DialogHeader>
          {editing !== null && (
            <SlideForm
              slide={editing === "new" ? null : editing}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <ConfirmDelete
        open={deletingId !== null}
        title="Delete slide?"
        description="This will remove the slide from the homepage carousel permanently."
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
