"use client";

import { useState, useMemo, Fragment } from "react";
import { ShoppingBag, Search, ChevronDown, Phone } from "lucide-react";
import { updateOrderStatus, updateOrderPayment } from "@/lib/admin/actions";
import { StatusPill, StatusSelect, EmptyState } from "./shared/ui";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
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
                        <a
                          href={`tel:${o.customerPhone}`}
                          className="text-xs text-secondary-text hover:text-forest inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {o.customerPhone}
                        </a>
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
                      <td colSpan={7} className="px-4 py-4">
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
                            <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-2">
                              Delivery Address
                            </h4>
                            {o.shippingAddress ? (
                              <p className="text-xs text-secondary-text leading-relaxed">
                                {o.shippingAddress.address}
                                <br />
                                {o.shippingAddress.city} {o.shippingAddress.pincode}
                                <br />
                                {o.shippingAddress.state}
                              </p>
                            ) : (
                              <p className="text-xs text-secondary-text">Not provided</p>
                            )}
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
