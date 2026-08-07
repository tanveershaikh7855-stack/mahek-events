"use client";

import { useState, useMemo, useTransition, Fragment } from "react";
import { toast } from "sonner";
import { CalendarCheck, Search, ChevronDown, Phone, MessageCircle, Loader2 } from "lucide-react";
import { updateBookingStatus, updateBookingQuote } from "@/lib/admin/actions";
import { StatusSelect, EmptyState } from "./shared/ui";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { waLink, bookingWaMessage } from "@/lib/whatsapp-link";

const BOOKING_STATUSES = ["NEW", "FOLLOW_UP", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;

export type BookingRow = {
  id: string;
  bookingNumber: string;
  customerName: string | null;
  customerPhone: string | null;
  eventType: string;
  venue: string | null;
  eventDate: string | null;
  eventTime: string | null;
  budget: number | null;
  quotedAmount: number | null;
  instructions: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

function QuoteForm({ booking }: { booking: BookingRow }) {
  const [pending, start] = useTransition();

  return (
    <form
      action={(formData) =>
        start(async () => {
          const res = await updateBookingQuote(booking.id, formData);
          if (res.ok) toast.success(res.message ?? "Saved");
          else toast.error(res.error);
        })
      }
      className="flex items-end gap-2"
    >
      <div className="flex-1">
        <label className="text-[11px] font-medium text-secondary-text block mb-1">
          Quote amount (₹)
        </label>
        <input
          name="quotedAmount"
          type="number"
          min={0}
          step={1}
          defaultValue={booking.quotedAmount ?? ""}
          placeholder="0"
          className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-forest"
        />
      </div>
      <div className="flex-1">
        <label className="text-[11px] font-medium text-secondary-text block mb-1">
          Follow up on
        </label>
        <input
          name="followUpDate"
          type="date"
          className="w-full rounded-lg border border-border bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-forest"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white hover:bg-forest-hover disabled:opacity-60"
      >
        {pending && <Loader2 className="w-3 h-3 animate-spin" />}
        Save
      </button>
    </form>
  );
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (filter !== "ALL" && b.status !== filter) return false;
      if (!q) return true;
      return (
        b.bookingNumber.toLowerCase().includes(q) ||
        (b.customerName ?? "").toLowerCase().includes(q) ||
        (b.customerPhone ?? "").includes(q) ||
        b.eventType.toLowerCase().includes(q)
      );
    });
  }, [bookings, query, filter]);

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="No bookings yet"
        hint="Decoration enquiries and product bookings from the website land here."
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
            placeholder="Search booking, name, phone or event"
            className="w-full min-h-[44px] rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-forest"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="min-h-[44px] min-w-[160px] rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-forest"
        >
          <option value="ALL">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-secondary-text">
        Showing {filtered.length} of {bookings.length} bookings
      </p>

      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Booking</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Event</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Budget</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Status</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <Fragment key={b.id}>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">
                      {b.bookingNumber}
                      <p className="text-xs font-normal text-secondary-text">
                        {formatDate(b.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink">{b.customerName || "Guest"}</p>
                      {b.customerPhone && (
                        <div className="flex flex-col gap-1 mt-0.5">
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="text-xs text-secondary-text hover:text-forest inline-flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {b.customerPhone}
                          </a>
                          {/* One-tap WhatsApp with the message already written.
                              Previously this interpolated the raw phone after
                              "91", so any formatted number produced a dead link,
                              and it carried no message at all. */}
                          <a
                            href={waLink(b.customerPhone, bookingWaMessage(b))}
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
                    <td className="px-4 py-3">
                      <p className="text-ink capitalize">{b.eventType}</p>
                      <p className="text-xs text-secondary-text">
                        {b.eventDate ? formatDate(b.eventDate) : "Date TBD"}
                        {b.eventTime ? ` · ${b.eventTime}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {b.quotedAmount ? (
                        <>
                          <p className="font-semibold text-ink tabular-nums">{formatPrice(b.quotedAmount)}</p>
                          <p className="text-xs text-secondary-text">quoted</p>
                        </>
                      ) : b.budget ? (
                        <>
                          <p className="text-ink tabular-nums">{formatPrice(b.budget)}</p>
                          <p className="text-xs text-secondary-text">customer budget</p>
                        </>
                      ) : (
                        <span className="text-xs text-secondary-text">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        value={b.status}
                        options={BOOKING_STATUSES}
                        onChange={(next) => updateBookingStatus(b.id, next)}
                      />
                    </td>
                    <td className="px-2">
                      <button
                        onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                        aria-label="Toggle details"
                      >
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-secondary-text transition-transform",
                            expanded === b.id && "rotate-180",
                          )}
                        />
                      </button>
                    </td>
                  </tr>
                  {expanded === b.id && (
                    <tr className="bg-secondary/30 border-t border-border">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-xs font-semibold text-ink uppercase tracking-wide">
                                Venue
                              </h4>
                              <p className="text-xs text-secondary-text mt-1">
                                {b.venue || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-ink uppercase tracking-wide">
                                Instructions
                              </h4>
                              <p className="text-xs text-secondary-text mt-1 whitespace-pre-wrap">
                                {b.instructions || "None"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-2">
                              Quote &amp; follow-up
                            </h4>
                            <QuoteForm booking={b} />
                            <p className="text-[11px] text-secondary-text mt-2">
                              Saving a quote also sets the 50% advance automatically.
                            </p>
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
