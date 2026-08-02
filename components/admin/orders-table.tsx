"use client";

import { useState, useMemo, Fragment } from "react";
import { ShoppingBag, Search, ChevronDown, Phone, MapPin, Calendar, MessageCircle } from "lucide-react";
import { updateOrderStatus, updateOrderPayment, updateOrderPickup } from "@/lib/admin/actions";
import { StatusPill, StatusSelect, EmptyState } from "./shared/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { waLink, orderWaMessage } from "@/lib/whatsapp-link";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

const PAYMENT_STATUSES = ["PENDING", "PARTIALLY_PAID", "PAID", "FAILED", "REFUNDED"] as const;

export type OrderRow = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  total: number;
  advanceAmount: number;
  amountPaid: number;
  balanceDue: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  notes: string | null;
  shippingAddress: Record<string, string> | null;
  pickupDate: string | null;
  pickupTime: string | null;
  setupRequested: boolean;
  setupAddress: string | null;
  setupDate: string | null;
  setupTime: string | null;
  items: { id: string; name: string; quantity: number; price: number }[];
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "ALL" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        (o.customerName ?? "").toLowerCase().includes(q) ||
        (o.customerPhone ?? "").includes(q)
      );
    });
  }, [orders, query, filter]);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No orders yet"
        hint="Orders placed on the website will appear here in real time."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order number, name or phone"
            className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-forest"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-secondary-text">
        Showing {filtered.length} of {orders.length} orders
      </p>

      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px]">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Order</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Pickup</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Total</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Payment</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Status</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Date</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <Fragment key={o.id}>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                      {o.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink">{o.customerName || "Guest"}</p>
                      {o.customerPhone && (
                        <div className="flex flex-col gap-1 mt-0.5">
                          <a
                            href={`tel:${o.customerPhone}`}
                            className="text-xs text-secondary-text hover:text-forest inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {o.customerPhone}
                          </a>
                          <a
                            href={waLink(o.customerPhone, orderWaMessage(o))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-[#25D366] hover:underline inline-flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {o.pickupDate ? (
                        <div className="text-xs">
                          <p className="text-ink font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(o.pickupDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          {o.pickupTime && (
                            <p className="text-secondary-text">{o.pickupTime}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-secondary-text">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{formatPrice(o.total)}</p>
                      {o.balanceDue > 0 && (
                        <p className="text-xs text-secondary-text">
                          {formatPrice(o.balanceDue)} due
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={o.paymentStatus}
                        options={PAYMENT_STATUSES}
                        onChange={(next) => updateOrderPayment(o.id, next)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={o.status}
                        options={ORDER_STATUSES}
                        onChange={(next) => updateOrderStatus(o.id, next)}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary-text whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-2">
                      <button
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        aria-label="Toggle details"
                      >
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-secondary-text transition-transform",
                            expanded === o.id && "rotate-180",
                          )}
                        />
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="bg-secondary/30 border-t border-border">
                      <td colSpan={8} className="px-4 py-4">
                        {o.setupRequested && (
                          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                              🎈 On-site setup requested — call with a quote
                            </p>
                            <p className="mt-1 text-sm text-ink">
                              {o.setupAddress || "No venue address"}
                            </p>
                            {o.setupDate && (
                              <p className="text-xs text-secondary-text">
                                Setup on{" "}
                                {new Date(o.setupDate).toLocaleDateString("en-IN", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                })}
                                {o.setupTime ? ` at ${o.setupTime}` : ""}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-2">
                              Items
                            </h4>
                            <ul className="space-y-1.5">
                              {o.items.map((i) => (
                                <li key={i.id} className="flex justify-between text-xs">
                                  <span className="text-secondary-text">
                                    {i.name} × {i.quantity}
                                  </span>
                                  <span className="text-ink font-medium">
                                    {formatPrice(i.price * i.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-2 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Shop Pickup
                            </h4>
                            <PickupEditor
                              orderId={o.id}
                              pickupDate={o.pickupDate}
                              pickupTime={o.pickupTime}
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-2">
                              Payment
                            </h4>
                            <dl className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <dt className="text-secondary-text">Method</dt>
                                <dd className="text-ink">{o.paymentMethod}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-secondary-text">Advance</dt>
                                <dd className="text-ink">{formatPrice(o.advanceAmount)}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-secondary-text">Paid</dt>
                                <dd className="text-ink">{formatPrice(o.amountPaid)}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt className="text-secondary-text">Balance</dt>
                                <dd className="font-semibold text-ink">
                                  {formatPrice(o.balanceDue)}
                                </dd>
                              </div>
                            </dl>
                            {o.notes && (
                              <p className="text-xs text-secondary-text mt-2 italic">{o.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const PICKUP_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

function PickupEditor({
  orderId,
  pickupDate,
  pickupTime,
}: {
  orderId: string;
  pickupDate: string | null;
  pickupTime: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(
    pickupDate ? pickupDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
  );
  const [time, setTime] = useState(pickupTime ?? "11:00 AM");

  if (!editing) {
    return (
      <div className="text-xs text-secondary-text leading-relaxed">
        {pickupDate ? (
          <p>
            <strong className="text-ink">
              {new Date(pickupDate).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </strong>
            {pickupTime && (
              <>
                <br />
                at <strong className="text-ink">{pickupTime}</strong>
              </>
            )}
            <br />
            Saras Baug, Pune 411004
          </p>
        ) : (
          <p>No pickup slot</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-forest hover:underline font-semibold"
          >
            {pickupDate ? "Edit slot" : "Set slot"}
          </button>
          <a
            href="https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest hover:underline"
          >
            Map
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-xs">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-2 py-1.5 focus:outline-none focus:border-forest"
      />
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full rounded-lg border border-border bg-white px-2 py-1.5 focus:outline-none focus:border-forest"
      >
        {PICKUP_SLOTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            setSaving(true);
            await updateOrderPickup(orderId, date, time);
            setSaving(false);
            setEditing(false);
          }}
          className="flex-1 rounded-lg bg-forest px-3 py-1.5 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-lg border border-border px-3 py-1.5 hover:bg-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
