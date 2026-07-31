import type { Metadata } from "next";
import { getBookings } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { BookingsTable } from "@/components/admin/bookings-table";

export const metadata: Metadata = { title: "Bookings | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await getBookings();

  const rows = bookings.map((b) => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    eventType: b.eventType,
    venue: b.venue,
    eventDate: b.eventDate ? b.eventDate.toISOString() : null,
    eventTime: b.eventTime,
    budget: b.budget ? Number(b.budget) : null,
    quotedAmount: b.quotedAmount ? Number(b.quotedAmount) : null,
    instructions: b.instructions,
    status: b.status,
    paymentStatus: b.paymentStatus,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <PageShell title="Bookings">
      <BookingsTable bookings={rows} />
    </PageShell>
  );
}
