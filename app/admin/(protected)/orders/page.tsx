import type { Metadata } from "next";
import { getOrders } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { OrdersTable } from "@/components/admin/orders-table";

export const metadata: Metadata = { title: "Orders | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  // Decimal and Date are not serialisable across the server/client boundary.
  const rows = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    total: Number(o.total),
    advanceAmount: Number(o.advanceAmount),
    amountPaid: Number(o.amountPaid),
    balanceDue: Number(o.balanceDue),
    status: o.status,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
    notes: o.notes,
    shippingAddress: o.shippingAddress as Record<string, string> | null,
    pickupDate: o.pickupDate ? o.pickupDate.toISOString() : null,
    pickupTime: o.pickupTime,
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: Number(i.price),
    })),
  }));

  return (
    <PageShell title="Orders">
      <OrdersTable orders={rows} />
    </PageShell>
  );
}
