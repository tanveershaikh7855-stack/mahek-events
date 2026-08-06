"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Sparkles, Plus, Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { saveService, deleteService, toggleServiceActive } from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { ImageUploader } from "./shared/image-uploader";
import { ServiceAIFill } from "./shared/ai-fill";
import { formatPrice, cn } from "@/lib/utils";

export type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceFrom: number;
  image: string;
  images: string[];
  features: string[];
  sortOrder: number;
  isActive: boolean;
};

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function ServiceDialog({
  item,
  open,
  onOpenChange,
}: {
  item: ServiceRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit service" : "Add service"}</DialogTitle>
          <DialogDescription>
            Services appear on the public Services page as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveService(item?.id ?? null, formData);
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
            label="Main service photo (used on cards and page hero)"
            defaultValue={item?.image ? [item.image] : []}
            multiple={false}
          />

          <div className="flex items-center justify-between rounded-xl border border-dashed border-forest/40 bg-forest-light/50 px-3 py-2">
            <p className="text-xs text-forest">
              <strong>New:</strong> upload the main photo, then click AI Fill to auto-write everything else.
            </p>
            <ServiceAIFill imageField="image" />
          </div>

          <ImageUploader
            name="images"
            label="Gallery photos (customers see these on the service page)"
            defaultValue={item?.images ?? []}
            multiple
          />

          <div>
            <label className={labelCls}>Service name *</label>
            <input name="name" defaultValue={item?.name ?? ""} required className={field} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Starting price (₹) *</label>
              <input
                name="priceFrom"
                type="number"
                min={0}
                step="1"
                defaultValue={item?.priceFrom ?? ""}
                required
                className={field}
              />
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

          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              defaultValue={item?.description ?? ""}
              required
              rows={3}
              className={field}
            />
          </div>

          <div>
            <label className={labelCls}>Features (one per line)</label>
            <textarea
              name="features"
              defaultValue={item?.features?.join("\n") ?? ""}
              rows={4}
              placeholder={"Theme customization\nBalloon arch or bunches\nSetup & takedown"}
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
              {item ? "Save changes" : "Add service"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ActiveToggle({ item }: { item: ServiceRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleServiceActive(item.id, !item.isActive);
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

export function ServicesManager({ services }: { services: ServiceRow[] }) {
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-text">
          {services.length} service{services.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
        >
          <Plus className="w-4 h-4" />
          Add service
        </button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No services yet"
          hint="Add the decoration services you offer."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.id}
              className="flex gap-3 rounded-2xl border border-border bg-white p-3"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
                {s.image && (
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink truncate">{s.name}</p>
                  <ActiveToggle item={s} />
                </div>
                <p className="text-xs text-secondary-text">
                  From {formatPrice(s.priceFrom)}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-secondary-text">
                  {s.description}
                </p>
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
                    title="Delete this service?"
                    description="It will be removed from the services page permanently."
                    onConfirm={() => deleteService(s.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceDialog
        key={editing?.id ?? "new-service"}
        item={editing}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
