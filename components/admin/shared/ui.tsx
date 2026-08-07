"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Result = { ok: true; message?: string } | { ok: false; error: string };

// ── Status pill ───────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  // orders
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-forest-light text-forest border-forest/20",
  PROCESSING: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-600 border-gray-200",
  // payments
  PARTIALLY_PAID: "bg-amber-100 text-amber-700 border-amber-200",
  PAID: "bg-green-100 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  // bookings
  NEW: "bg-yellow-100 text-yellow-700 border-yellow-200",
  FOLLOW_UP: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Status <select> that runs a server action ─────────────────

export function StatusSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (next: string) => Promise<Result>;
}) {
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState(value);

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          const prev = current;
          setCurrent(next);
          start(async () => {
            const res = await onChange(next);
            if (res.ok) toast.success(res.message ?? "Updated");
            else {
              setCurrent(prev);
              toast.error(res.error);
            }
          });
        }}
        className="appearance-none rounded-lg border border-border bg-white pl-3 pr-8 py-1.5 min-h-[36px] text-xs font-medium text-ink focus:outline-none focus:border-forest disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      {pending && (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-forest absolute right-2 pointer-events-none" />
      )}
    </div>
  );
}

// ── Confirm-and-delete button ─────────────────────────────────

export function ConfirmDelete({
  onConfirm,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  label,
}: {
  onConfirm: () => Promise<Result>;
  title?: string;
  description?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors",
          label ? "px-3 py-1.5 text-xs font-medium border border-red-200 min-h-[44px]" : "w-9 h-9",
        )}
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  const res = await onConfirm();
                  if (res.ok) {
                    toast.success(res.message ?? "Deleted");
                    setOpen(false);
                  } else {
                    toast.error(res.error);
                  }
                })
              }
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Empty state ───────────────────────────────────────────────

export function EmptyState({ icon: Icon, title, hint }: { icon: React.ElementType; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-secondary-text" />
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint && <p className="text-xs text-secondary-text mt-1 max-w-xs">{hint}</p>}
    </div>
  );
}
