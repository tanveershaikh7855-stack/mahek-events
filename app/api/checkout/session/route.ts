import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStripe, toPaise } from "@/lib/stripe";
import { features, env } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({ orderId: z.string().min(1) });

/**
 * Creates a Stripe Checkout Session for the advance only.
 *
 * The amount is read from the order row — never from the request body — so a
 * caller cannot ask to pay ₹1 against a ₹10,000 order.
 */
export async function POST(request: Request) {
  if (!features.stripe) {
    return NextResponse.json(
      { error: "Online payment is not available. Please choose cash on delivery." },
      { status: 503 },
    );
  }

  let orderId: string;
  try {
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    orderId = parsed.data.orderId;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      orderNumber: true,
      advanceAmount: true,
      total: true,
      paymentStatus: true,
      stripeSessionId: true,
      shippingAddress: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID") {
    return NextResponse.json(
      { error: "This order has already been paid" },
      { status: 409 },
    );
  }

  const stripe = requireStripe();
  const advance = Number(order.advanceAmount);
  const shipping = order.shippingAddress as { email?: string } | null;

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "inr",
              unit_amount: toPaise(advance),
              product_data: {
                name: `Advance payment — order ${order.orderNumber}`,
                description: `50% advance to confirm your order. Balance payable on delivery.`,
              },
            },
          },
        ],
        customer_email: shipping?.email || undefined,
        // Read back by the webhook to locate the order.
        metadata: { orderId: order.id, orderNumber: order.orderNumber },
        payment_intent_data: {
          metadata: { orderId: order.id, orderNumber: order.orderNumber },
        },
        success_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/checkout?cancelled=${order.orderNumber}`,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      },
      // Retrying this endpoint must not create a second session for one order.
      { idempotencyKey: `order-advance-${order.id}` },
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout/session] Stripe error:", error);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
