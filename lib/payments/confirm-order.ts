import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import * as email from "@/lib/notifications/email";
import * as whatsapp from "@/lib/notifications/whatsapp";
import { formatPrice } from "@/lib/formatters";

/**
 * Marks an order's advance as paid and confirms it, then notifies the customer.
 *
 * This is the single place an order becomes CONFIRMED, shared by the browser
 * success callback (app/api/checkout/verify) and the Razorpay webhook
 * (app/api/webhooks/razorpay). Both can fire for one payment, so it is
 * idempotent: a replay against an already-paid order is a no-op.
 */
export async function confirmOrderPaid(params: {
  orderId: string;
  paymentId: string;
  amountPaid: number;
}): Promise<{ confirmed: boolean }> {
  const { orderId, paymentId, amountPaid } = params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    console.warn("[confirmOrderPaid] unknown orderId:", orderId);
    return { confirmed: false };
  }

  // At-least-once delivery: ignore a replay of an order we already confirmed.
  if (order.paymentStatus === "PARTIALLY_PAID" || order.paymentStatus === "PAID") {
    return { confirmed: false };
  }

  const total = Number(order.total);
  const settledInFull = amountPaid >= total;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CONFIRMED",
      // A 50%-style advance leaves the order PARTIALLY_PAID; only a full
      // settlement is PAID.
      paymentStatus: settledInFull ? "PAID" : "PARTIALLY_PAID",
      amountPaid: new Prisma.Decimal(amountPaid),
      balanceDue: new Prisma.Decimal(Math.max(0, total - amountPaid)),
      paidAt: new Date(),
      confirmedAt: new Date(),
      razorpayPaymentId: paymentId,
    },
  });

  const shipping = updated.shippingAddress as {
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  const balanceDue = Number(updated.balanceDue);
  const isPickup = updated.deliveryType === "PICKUP";
  const balanceLabel = isPickup ? "Balance at pickup" : "Balance on delivery";

  await Promise.allSettled([
    email.sendOrderConfirmedEmail({
      orderNumber: updated.orderNumber,
      customerName: shipping?.name ?? "Customer",
      customerEmail: shipping?.email || null,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: Number(i.price),
      })),
      subtotal: Number(updated.subtotal),
      discount: Number(updated.discount),
      deliveryCharge: Number(updated.deliveryCharge),
      gst: Number(updated.gst),
      total,
      advanceAmount: amountPaid,
      balanceDue,
      paymentMethod: updated.paymentMethod,
    }),
    email.sendAdminAlert(`Order ${updated.orderNumber} confirmed — advance received`, [
      `Customer: ${shipping?.name ?? "?"} (${shipping?.phone ?? "?"})`,
      `Advance paid: ${formatPrice(amountPaid)}`,
      `${balanceLabel}: ${formatPrice(balanceDue)}`,
    ]),
    shipping?.phone
      ? whatsapp.sendText(
          shipping.phone,
          `Payment received. Order ${updated.orderNumber} is confirmed. ` +
            `Advance paid: ${formatPrice(amountPaid)}. ` +
            (balanceDue > 0
              ? `${balanceLabel}: ${formatPrice(balanceDue)}.`
              : `Paid in full.`) +
            ` — Mahek Balloons`,
        )
      : Promise.resolve(),
  ]);

  return { confirmed: true };
}
