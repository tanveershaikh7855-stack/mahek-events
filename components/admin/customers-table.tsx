"use client";

import { useState, useMemo } from "react";
import { Users, Search, Phone, Mail, MessageCircle } from "lucide-react";
import { EmptyState } from "./shared/ui";
import { formatDate } from "@/lib/utils";

export type CustomerRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  orders: number;
  bookings: number;
  createdAt: string;
};

export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email ?? "").toLowerCase().includes(q),
    );
  }, [customers, query]);

  if (customers.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No customers yet"
        hint="A customer record is created automatically with the first order or booking."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone or email"
          className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-forest"
        />
      </div>

      <p className="text-xs text-secondary-text">
        Showing {filtered.length} of {customers.length} customers
      </p>

      <div className="rounded-2xl border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Name</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Bookings</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-text">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${c.phone}`}
                        className="text-xs text-secondary-text hover:text-forest inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </a>
                      <a
                        href={`https://wa.me/91${c.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-secondary-text hover:text-forest inline-flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink">{c.orders}</td>
                  <td className="px-4 py-3 text-ink">{c.bookings}</td>
                  <td className="px-4 py-3 text-xs text-secondary-text whitespace-nowrap">
                    {formatDate(c.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
