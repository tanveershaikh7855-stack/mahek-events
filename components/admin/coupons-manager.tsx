"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Tag, Plus, Pencil, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { saveCoupon, deleteCoupon } from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { formatPrice, cn } from "@/lib/utils";

export type CouponRow = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
};

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function CouponDialog({
  coupon,
  open,
  onOpenChange,
}: {
  coupon: CouponRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{coupon ? "Edit coupon" : "New coupon"}</DialogTitle>
          <DialogDescription>
            Customers enter this code at checkout to get the discount.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveCoupon(coupon?.id ?? null, formData);
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
          <div>
            <label className={labelCls}>Code *</label>
            <input
              name="code"
              defaultValue={coupon?.code}
              required
              placeholder="WELCOME10"
              className={cn(field, "uppercase font-mono")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select name="type" defaultValue={coupon?.type ?? "PERCENTAGE"} className={field}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed amount (₹)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Value *</label>
              <input
                name="value"
                type="number"
                min={0}
                step="0.01"
                defaultValue={coupon?.value}
                required
                className={field}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Min order (₹)</label>
              <input
                name="minOrder"
                type="number"
                min={0}
                defaultValue={coupon?.minOrder ?? ""}
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Usage limit</label>
              <input
                name="usageLimit"
                type="number"
                min={0}
                defaultValue={coupon?.usageLimit ?? ""}
                placeholder="Unlimited"
                className={field}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={coupon?.isActive ?? true}
              className="rounded border-border"
            />
            Active
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
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CouponsManager({ coupons }: { coupons: CouponRow[] }) {
  const [editing, setEditing] = useState<CouponRow | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
        >
          <Plus className="w-4 h-4" />
          New coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No coupons yet"
          hint="Create a discount code customers can use at checkout."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-secondary-text">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-text">Discount</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-text">Min order</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-text">Used</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-text">Status</th>
                  <th className="w-24" />
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-4 py-3 font-mono font-medium text-ink">{c.code}</td>
                    <td className="px-4 py-3 text-ink">
                      {c.type === "PERCENTAGE" ? `${c.value}%` : formatPrice(c.value)}
                    </td>
                    <td className="px-4 py-3 text-secondary-text">
                      {c.minOrder ? formatPrice(c.minOrder) : "—"}
                    </td>
                    <td className="px-4 py-3 text-secondary-text">
                      {c.usageCount}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                          c.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200",
                        )}
                      >
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditing(c);
                            setOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4 text-secondary-text" />
                        </button>
                        <ConfirmDelete
                          title={`Delete coupon ${c.code}?`}
                          onConfirm={() => deleteCoupon(c.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CouponDialog
        key={editing?.id ?? "new-coupon"}
        coupon={editing}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
