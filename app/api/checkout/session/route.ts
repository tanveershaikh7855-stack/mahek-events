import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRazorpay, toPaise } from "@/lib/razorpay";
import { features, env } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({ orderId: z.string().min(1) });

/**
 * Creates a Razorpay Order for the advance only.
 *
 * The amount is read from the order row — never from the request body — so a
 * caller cannot ask to pay ₹1 against a ₹10,000 order. Returns the Razorpay
 * order id plus the public key id, which the browser hands to the Razorpay
 * Checkout modal.
 */
export async function POST(request: Request) {
  if (!features.razorpay) {
    return NextResponse.json(
      { error: "Online payment is not available. Please choose Cash at Shop." },
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
      razorpayOrderId: true,
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

  const razorpay = requireRazorpay();
  const advance = Number(order.advanceAmount);
  const shipping = order.shippingAddress as {
    name?: string;
    email?: string;
    phone?: string;
  } | null;

  try {
    // Reuse an existing unpaid Razorpay order if this endpoint is retried, so
    // one shop order never spawns duplicate payment attempts.
    const rzpOrder =
      order.razorpayOrderId ??
      (
        await razorpay.orders.create({
          amount: toPaise(advance),
          currency: "INR",
          receipt: order.orderNumber,
          notes: { orderId: order.id, orderNumber: order.orderNumber },
        })
      ).id;

    if (!order.razorpayOrderId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: rzpOrder },
      });
    }

    return NextResponse.json({
      razorpayOrderId: rzpOrder,
      keyId: env.RAZORPAY_KEY_ID,
      amount: toPaise(advance),
      currency: "INR",
      orderNumber: order.orderNumber,
      name: "Mahek Balloons",
      description: `Advance for order ${order.orderNumber}`,
      prefill: {
        name: shipping?.name ?? "",
        email: shipping?.email ?? "",
        contact: shipping?.phone ?? "",
      },
    });
  } catch (error) {
    console.error("[checkout/session] Razorpay error:", error);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
