import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { features } from "@/lib/env";
import { verifyWebhookSignature, fromPaise } from "@/lib/razorpay";
import { confirmOrderPaid } from "@/lib/payments/confirm-order";

// Must run on Node — signature verification needs the raw body and node crypto.
export const runtime = "nodejs";

/**
 * Backup confirmation path.
 *
 * If the customer closes the tab before the browser callback fires, this
 * server-to-server webhook still confirms the order. Every request is verified
 * against RAZORPAY_WEBHOOK_SECRET first; confirmOrderPaid is idempotent so it is
 * safe even when both this and the browser callback run.
 */
export async function POST(request: Request) {
  if (!features.razorpayWebhook) {
    // No secret configured — accept-and-ignore so Razorpay does not pile up
    // retries. The browser verify route is still confirming orders.
    return NextResponse.json({ received: true, note: "webhook secret not set" });
  }

  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await request.text();
  if (!verifyWebhookSignature(raw, signature)) {
    console.error("[razorpay-webhook] signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: { id?: string; order_id?: string; amount?: number } };
    };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    // "payment.captured" is the definitive "money settled" event.
    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      const rzpOrderId = payment?.order_id;
      const paymentId = payment?.id;
      if (rzpOrderId && paymentId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: rzpOrderId },
          select: { id: true, advanceAmount: true },
        });
        if (order) {
          await confirmOrderPaid({
            orderId: order.id,
            paymentId,
            // Prefer the row amount; fall back to the event amount.
            amountPaid: Number(order.advanceAmount) || fromPaise(payment?.amount ?? 0),
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[razorpay-webhook] handler failed:`, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
