import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Package, Phone, Mail, ShoppingBag, MapPin, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = {
  title: "My Account | Mahek Balloons",
  description: "Manage your profile, bookings, and account settings.",
};

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  NEW: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-forest-light text-forest",
  PROCESSING: "bg-blue-100 text-blue-700",
  READY_FOR_PICKUP: "bg-emerald-100 text-emerald-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function Pill({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_STYLE[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  // Staff belong in the admin dashboard, not the shopper account page.
  if (session.user.role !== "CUSTOMER") redirect("/admin");

  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          deliveryType: true,
          pickupDate: true,
          pickupTime: true,
        },
      },
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          bookingNumber: true,
          eventType: true,
          eventDate: true,
          status: true,
          quotedAmount: true,
        },
      },
    },
  });

  if (!customer) redirect("/login?callbackUrl=/account");

  return (
    <main className="min-h-screen pt-20 md:pt-24 bg-background">
      <section className="section-spacing">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-section text-ink">My Account</h1>
              <p className="body-large mt-2">Welcome back, {customer.name}.</p>
            </div>
            <SignOutButton />
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-border bg-white p-4">
              <Mail className="w-4 h-4 text-forest mb-2" />
              <p className="text-xs text-secondary-text">Email</p>
              <p className="text-sm font-medium text-ink break-all">
                {customer.email ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <Phone className="w-4 h-4 text-forest mb-2" />
              <p className="text-xs text-secondary-text">Phone</p>
              <p className="text-sm font-medium text-ink">{customer.phone}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-4">
              <Package className="w-4 h-4 text-forest mb-2" />
              <p className="text-xs text-secondary-text">Orders &amp; bookings</p>
              <p className="text-sm font-medium text-ink">
                {customer.orders.length + customer.bookings.length}
              </p>
            </div>
          </div>

          <h2 className="font-heading text-lg font-bold text-ink mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-forest" /> Orders
          </h2>
          {customer.orders.length === 0 ? (
            <p className="text-sm text-secondary-text mb-10">
              No orders yet.{" "}
              <Link href="/shop" className="text-forest underline">
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <div className="rounded-2xl border border-border bg-white overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Order</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Total</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((o) => (
                      <tr key={o.id} className="border-t border-border align-top">
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{o.orderNumber}</p>
                          {o.deliveryType === "PICKUP" && o.pickupDate && (
                            <p className="text-xs text-secondary-text mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              Pickup{" "}
                              {o.pickupDate.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                              {o.pickupTime && (
                                <>
                                  {" "}
                                  <Clock className="w-3 h-3" /> {o.pickupTime}
                                </>
                              )}
                            </p>
                          )}
                          {o.deliveryType === "DELIVERY" && (
                            <p className="text-xs text-secondary-text mt-1">Home delivery</p>
                          )}
                          {o.status === "READY_FOR_PICKUP" && (
                            <a
                              href="https://maps.app.goo.gl/8WdoEqNAuCB9Qzwf7"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-forest hover:underline"
                            >
                              <MapPin className="w-3 h-3" /> Directions to shop
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-secondary-text">
                          {o.createdAt.toISOString().slice(0, 10)}
                        </td>
                        <td className="px-4 py-3 text-ink">{formatPrice(Number(o.total))}</td>
                        <td className="px-4 py-3">
                          <Pill status={o.status} />
                        </td>
                        <td className="px-4 py-3">
                          <Pill status={o.paymentStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <h2 className="font-heading text-lg font-bold text-ink mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest" /> Decoration bookings
          </h2>
          {customer.bookings.length === 0 ? (
            <p className="text-sm text-secondary-text">
              No bookings yet.{" "}
              <Link href="/booking" className="text-forest underline">
                Book a decoration
              </Link>
              .
            </p>
          ) : (
            <div className="rounded-2xl border border-border bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Booking</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Event</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Quote</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.bookings.map((b) => (
                      <tr key={b.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium text-ink">{b.bookingNumber}</td>
                        <td className="px-4 py-3 text-secondary-text">{b.eventType}</td>
                        <td className="px-4 py-3 text-secondary-text">
                          {b.eventDate ? b.eventDate.toISOString().slice(0, 10) : "—"}
                        </td>
                        <td className="px-4 py-3 text-ink">
                          {b.quotedAmount ? formatPrice(Number(b.quotedAmount)) : "Pending"}
                        </td>
                        <td className="px-4 py-3">
                          <Pill status={b.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
