"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Tag, Plus, Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { saveOffer, deleteOffer, toggleOfferActive } from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { ImageUploader } from "./shared/image-uploader";
import { cn } from "@/lib/utils";

export type OfferRow = {
  id: string;
  title: string;
  slug: string;
  badge: string | null;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  discountLabel: string | null;
  couponCode: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  categorySlug: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type CategoryOption = { slug: string; name: string };

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function OfferDialog({
  offer,
  categories,
  open,
  onOpenChange,
}: {
  offer: OfferRow | null;
  categories: CategoryOption[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{offer ? "Edit offer" : "New offer"}</DialogTitle>
          <DialogDescription>
            Offers appear on the Offers page as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveOffer(offer?.id ?? null, formData);
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                name="title"
                defaultValue={offer?.title}
                required
                placeholder="Vacation Special"
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Badge</label>
              <input
                name="badge"
                defaultValue={offer?.badge ?? ""}
                placeholder="Limited time"
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Subtitle</label>
            <input
              name="subtitle"
              defaultValue={offer?.subtitle ?? ""}
              maxLength={300}
              placeholder="Beat the heat with breezy summer décor"
              className={field}
            />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={offer?.description ?? ""}
              className={cn(field, "resize-none")}
            />
          </div>

          <ImageUploader
            name="image"
            label="Banner image"
            defaultValue={offer?.image ? [offer.image] : []}
            multiple={false}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Discount label</label>
              <input
                name="discountLabel"
                defaultValue={offer?.discountLabel ?? ""}
                placeholder="Up to 30% OFF"
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Coupon code</label>
              <input
                name="couponCode"
                defaultValue={offer?.couponCode ?? ""}
                placeholder="SUMMER30"
                className={cn(field, "uppercase")}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Show products from category</label>
            <select
              name="categorySlug"
              defaultValue={offer?.categorySlug ?? ""}
              className={field}
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Button label</label>
              <input
                name="ctaLabel"
                defaultValue={offer?.ctaLabel ?? ""}
                placeholder="Shop the offer"
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Button link</label>
              <input
                name="ctaHref"
                defaultValue={offer?.ctaHref ?? ""}
                placeholder="/shop"
                className={field}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Starts (optional)</label>
              <input
                name="startDate"
                type="date"
                defaultValue={offer?.startDate ?? ""}
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Ends (optional)</label>
              <input
                name="endDate"
                type="date"
                defaultValue={offer?.endDate ?? ""}
                className={field}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className={labelCls}>Sort order</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={offer?.sortOrder ?? 0}
                className={field}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-ink mt-5">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={offer?.isActive ?? true}
                className="rounded border-border"
              />
              Published
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
              {offer ? "Save changes" : "Create offer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PublishToggle({ offer }: { offer: OfferRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleOfferActive(offer.id, !offer.isActive);
          if (res.ok) toast.success(res.message ?? "Updated");
          else toast.error(res.error);
        })
      }
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors disabled:opacity-60",
        offer.isActive
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {pending ? "…" : offer.isActive ? "Live" : "Hidden"}
    </button>
  );
}

export function OffersManager({
  offers,
  categories,
}: {
  offers: OfferRow[];
  categories: CategoryOption[];
}) {
  const [editing, setEditing] = useState<OfferRow | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-text">
          {offers.length} offer{offers.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
        >
          <Plus className="w-4 h-4" />
          New offer
        </button>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No offers yet"
          hint="Create seasonal offers like Vacation, Rainy or Exclusive."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl border border-border bg-white overflow-hidden"
            >
              <div className="relative aspect-[16/9] bg-secondary">
                {offer.image ? (
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    sizes="320px"
                    className="object-cover"
                    unoptimized={offer.image.startsWith("data:")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Tag className="w-8 h-8 text-secondary-text" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <PublishToggle offer={offer} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-ink truncate">{offer.title}</p>
                <p className="text-xs text-secondary-text truncate">
                  {offer.discountLabel || offer.subtitle || `/offers/${offer.slug}`}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => {
                      setEditing(offer);
                      setOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4 text-secondary-text" />
                  </button>
                  <ConfirmDelete
                    title={`Delete "${offer.title}"?`}
                    description="This removes the offer page permanently."
                    onConfirm={() => deleteOffer(offer.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <OfferDialog
        key={editing?.id ?? "new-offer"}
        offer={editing}
        categories={categories}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
