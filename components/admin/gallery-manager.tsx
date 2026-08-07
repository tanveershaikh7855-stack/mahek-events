"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon, Plus, Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  saveGalleryImage,
  deleteGalleryImage,
  toggleGalleryActive,
} from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { ImageUploader } from "./shared/image-uploader";
import { cn } from "@/lib/utils";

export type GalleryRow = {
  id: string;
  title: string | null;
  image: string;
  mediaType: "IMAGE" | "VIDEO";
  poster: string | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

// Starter suggestions. The real list is whatever categories already exist on
// gallery images (passed in as `knownCategories`) merged with these — the admin
// can pick one or type a brand-new category, which then appears on the
// storefront gallery filter automatically.
const SUGGESTED_CATEGORIES = [
  "birthday",
  "wedding",
  "baby-shower",
  "corporate",
  "proposal",
  "room-decor",
];

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function GalleryDialog({
  item,
  open,
  onOpenChange,
  knownCategories,
}: {
  item: GalleryRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  knownCategories: string[];
}) {
  const [pending, start] = useTransition();
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">(
    item?.mediaType ?? "IMAGE",
  );
  const [category, setCategory] = useState(item?.category ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto pb-6">
        <DialogHeader>
          <DialogTitle>{item ? "Edit image" : "Add gallery image"}</DialogTitle>
          <DialogDescription>
            Images appear on the public Gallery page as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveGalleryImage(item?.id ?? null, formData);
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
          <input type="hidden" name="mediaType" value={mediaType} />

          <ImageUploader
            name="image"
            label="Image or video *"
            defaultValue={item?.image ? [item.image] : []}
            defaultKind={item?.mediaType === "VIDEO" ? "video" : "image"}
            multiple={false}
            allowVideo
            onKindChange={(k) => setMediaType(k === "video" ? "VIDEO" : "IMAGE")}
          />

          {mediaType === "VIDEO" && (
            <ImageUploader
              name="poster"
              label="Video cover image (optional)"
              defaultValue={item?.poster ? [item.poster] : []}
              multiple={false}
            />
          )}

          <div>
            <label className={labelCls}>Title / caption</label>
            <input name="title" defaultValue={item?.title ?? ""} className={field} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              {/* Editable: pick an existing category or type a new one. It is
                  slugified on save and shows up on the storefront filter live. */}
              <input
                name="category"
                list="gallery-category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="e.g. birthday, haldi, engagement"
                className={field}
              />
              <datalist id="gallery-category-options">
                {knownCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
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
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={item?.isActive ?? true}
              className="rounded border-border"
            />
            Show on site
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
              {item ? "Save changes" : "Add image"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ActiveToggle({ item }: { item: GalleryRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleGalleryActive(item.id, !item.isActive);
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

export function GalleryManager({ images }: { images: GalleryRow[] }) {
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [open, setOpen] = useState(false);

  // Suggestions = starter list + every category already in use, de-duped.
  const knownCategories = Array.from(
    new Set([
      ...SUGGESTED_CATEGORIES,
      ...images.map((i) => i.category).filter(Boolean),
    ]),
  ).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-text">
          {images.length} image{images.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
        >
          <Plus className="w-4 h-4" />
          Add image
        </button>
      </div>

      {images.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No gallery images yet"
          hint="Add photos of your decoration work."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-white overflow-hidden"
            >
              <div className="relative aspect-[4/3] bg-secondary">
                {item.mediaType === "VIDEO" ? (
                  <>
                    <video
                      src={item.image}
                      poster={item.poster ?? undefined}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      ▶ VIDEO
                    </span>
                  </>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title ?? "Gallery image"}
                    fill
                    sizes="240px"
                    className="object-cover"
                    unoptimized={item.image.startsWith("data:")}
                  />
                )}
                <div className="absolute top-2 left-2">
                  <ActiveToggle item={item} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-ink truncate">
                  {item.title || "Untitled"}
                </p>
                <p className="text-xs text-secondary-text capitalize">
                  {item.category.replace(/-/g, " ")}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => {
                      setEditing(item);
                      setOpen(true);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4 text-secondary-text" />
                  </button>
                  <ConfirmDelete
                    title="Delete this image?"
                    description="It will be removed from the gallery permanently."
                    onConfirm={() => deleteGalleryImage(item.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GalleryDialog
        key={editing?.id ?? "new-gallery"}
        item={editing}
        open={open}
        onOpenChange={setOpen}
        knownCategories={knownCategories}
      />
    </div>
  );
}
