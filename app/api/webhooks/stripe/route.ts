import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireStripe, fromPaise } from "@/lib/stripe";
import { env, features } from "@/lib/env";
import * as email from "@/lib/notifications/email";
import * as whatsapp from "@/lib/notifications/whatsapp";
import { formatPrice } from "@/lib/formatters";

// Must run on Node — signature verification needs the raw body and node crypto.
export const runtime = "nodejs";

/**
 * The only place an order becomes CONFIRMED.
 *
 * Confirmation is driven by Stripe's signed webhook rather than by the browser
 * returning to a success URL, because a success URL can be opened by anyone who
 * guesses it. Every event is verified against STRIPE_WEBHOOK_SECRET first.
 */
export async function POST(request: Request) {
  if (!features.stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = requireStripe();
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    // A bad signature means the request did not come from Stripe.
    console.error("[stripe-webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleAdvancePaid(event.data.object);
        break;

      case "checkout.session.expired":
        await handleSessionExpired(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;

      default:
        // Unhandled types are acknowledged so Stripe stops retrying them.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`[stripe-webhook] handler for ${event.type} failed:`, error);
    // Non-2xx tells Stripe to retry with backoff.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

async function handleAdvancePaid(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.warn("[stripe-webhook] session without orderId metadata:", session.id);
    return;
  }

  if (session.payment_status !== "paid") return;

  const amountPaid = fromPaise(session.amount_total ?? 0);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    console.warn("[stripe-webhook] unknown orderId:", orderId);
    return;
  }

  // Webhooks are delivered at-least-once; ignore a replay of an order we have
  // already confirmed.
  if (order.paymentStatus === "PARTIALLY_PAID" || order.paymentStatus === "PAID") {
    return;
  }

  const total = Number(order.total);
  const settledInFull = amountPaid >= total;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CONFIRMED",
      // 50% advance received → PARTIALLY_PAID. Only a full settlement is PAID.
      paymentStatus: settledInFull ? "PAID" : "PARTIALLY_PAID",
      amountPaid: new Prisma.Decimal(amountPaid),
      balanceDue: new Prisma.Decimal(Math.max(0, total - amountPaid)),
      paidAt: new Date(),
      confirmedAt: new Date(),
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    },
  });

  const shipping = updated.shippingAddress as {
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  const balanceDue = Number(updated.balanceDue);

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
      `Balance on delivery: ${formatPrice(balanceDue)}`,
    ]),
    shipping?.phone
      ? whatsapp.sendText(
          shipping.phone,
          `Payment received. Order ${updated.orderNumber} is confirmed. ` +
            `Advance paid: ${formatPrice(amountPaid)}. ` +
            (balanceDue > 0
              ? `Balance due on delivery: ${formatPrice(balanceDue)}.`
              : `Paid in full.`) +
            ` — Mahek Balloon`,
        )
      : Promise.resolve(),
  ]);
}

/**
 * Abandoned payment: release the stock that submitCheckout reserved, otherwise
 * unpaid carts would slowly drain inventory.
 */
async function handleSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.paymentStatus !== "PENDING" || order.status !== "PENDING") {
      return;
    }

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usageCount: { decrement: 1 } },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED", paymentStatus: "FAILED" },
    });
  });
}

async function handlePaymentFailed(intent: Stripe.PaymentIntent) {
  const orderId = intent.metadata?.orderId;
  if (!orderId) return;

  await prisma.order.updateMany({
    where: { id: orderId, paymentStatus: "PENDING" },
    data: { paymentStatus: "FAILED" },
  });
}
