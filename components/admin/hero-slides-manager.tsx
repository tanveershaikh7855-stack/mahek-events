"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Loader2, ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  saveHeroSlide,
  deleteHeroSlide,
  toggleHeroSlideActive,
} from "@/lib/admin/actions";
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

function SlideDialog({
  item,
  open,
  onOpenChange,
}: {
  item: HeroSlideRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit hero slide" : "Add hero slide"}</DialogTitle>
          <DialogDescription>
            Changes appear on the homepage carousel as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveHeroSlide(item?.id ?? null, formData);
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
            name="image"
            label="Slide image"
            defaultValue={item?.image ? [item.image] : []}
            multiple={false}
          />

          <div>
            <label className={labelCls}>Title (optional — leave blank for photo only)</label>
            <input
              name="title"
              defaultValue={item?.title ?? ""}
              placeholder="e.g. Magical Balloon Setups"
              className={field}
            />
          </div>

          <div>
            <label className={labelCls}>Subtitle (optional)</label>
            <textarea
              name="subtitle"
              defaultValue={item?.subtitle ?? ""}
              rows={2}
              placeholder="e.g. Perfect for birthdays, weddings and every celebration"
              className={cn(field, "resize-none")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Button label</label>
              <input
                name="ctaLabel"
                defaultValue={item?.ctaLabel ?? ""}
                placeholder="Book Now"
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Button link</label>
              <input
                name="ctaHref"
                defaultValue={item?.ctaHref ?? ""}
                placeholder="/book"
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Sort order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={item?.sortOrder ?? 0}
              className={field}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={item?.isActive ?? true}
              className="rounded border-border"
            />
            Show on homepage
          </label>

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
              {item ? "Save changes" : "Add slide"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ActiveToggle({ item }: { item: HeroSlideRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleHeroSlideActive(item.id, !item.isActive);
          if (res.ok) toast.success(res.message ?? "Updated");
          else toast.error(res.error);
        })
      }
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors disabled:opacity-60",
        item.isActive
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {pending ? "…" : item.isActive ? "Live" : "Hidden"}
    </button>
  );
}

export function HeroSlidesManager({ slides }: { slides: HeroSlideRow[] }) {
  const [editing, setEditing] = useState<HeroSlideRow | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-text">
          {slides.length} slide{slides.length === 1 ? "" : "s"} — leave empty to use the built-in defaults.
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
        >
          <Plus className="w-4 h-4" />
          Add slide
        </button>
      </div>

      {slides.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No custom slides yet"
          hint="Add your own hero photos, or leave this empty to keep the built-in slides."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {slides.map((s) => (
            <div
              key={s.id}
              className="flex gap-3 rounded-2xl border border-border bg-white p-3"
            >
              <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                {s.image && (
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink truncate">{s.title}</p>
                  <ActiveToggle item={s} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-secondary-text">
                  {s.subtitle}
                </p>
                {s.ctaLabel && s.ctaHref && (
                  <p className="mt-1 text-[11px] text-forest">
                    CTA: {s.ctaLabel} → {s.ctaHref}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditing(s);
                      setOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <ConfirmDelete
                    title="Delete this slide?"
                    description="It will be removed from the homepage carousel permanently."
                    onConfirm={() => deleteHeroSlide(s.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SlideDialog
        key={editing?.id ?? "new-slide"}
        item={editing}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
