import type { Metadata } from "next";
import { getCustomers } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { CustomersTable } from "@/components/admin/customers-table";

export const metadata: Metadata = { title: "Customers | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await getCustomers();

  const rows = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    orders: c._count.orders,
    bookings: c._count.bookings,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <PageShell title="Customers">
      <CustomersTable customers={rows} />
    </PageShell>
  );
}
