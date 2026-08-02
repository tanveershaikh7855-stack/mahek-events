import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { features } from "@/lib/env";
import { verifyCheckoutSignature, fromPaise } from "@/lib/razorpay";
import { confirmOrderPaid } from "@/lib/payments/confirm-order";

export const runtime = "nodejs";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * Confirms an order from the browser success handler.
 *
 * The Razorpay Checkout modal returns a signature that proves the payment is
 * genuine; we verify it (HMAC over order_id|payment_id with the key secret)
 * before confirming anything, so a success callback cannot be forged. The
 * webhook is the backup path in case the customer closes the tab before this
 * fires — both call the same idempotent confirmOrderPaid.
 */
export async function POST(request: Request) {
  if (!features.razorpay) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const ok = verifyCheckoutSignature({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!ok) {
    console.error("[checkout/verify] signature mismatch for", razorpay_order_id);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  // Locate our order by the Razorpay order id we stored when creating it — the
  // amount charged comes from that row, not from the request.
  const order = await prisma.order.findUnique({
    where: { razorpayOrderId: razorpay_order_id },
    select: { id: true, orderNumber: true, advanceAmount: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await confirmOrderPaid({
    orderId: order.id,
    paymentId: razorpay_payment_id,
    amountPaid: Number(order.advanceAmount),
  });

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
}
