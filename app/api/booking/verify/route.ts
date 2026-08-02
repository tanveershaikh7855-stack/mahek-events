import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { features } from "@/lib/env";
import { verifyCheckoutSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

const bodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * Confirms a product booking's advance from the browser after Razorpay
 * Checkout. Verifies the signature before recording payment so it cannot be
 * forged; idempotent against replays.
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

  if (
    !verifyCheckoutSignature({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })
  ) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const booking = await prisma.booking.findFirst({
    where: { razorpayOrderId: razorpay_order_id },
    select: { id: true, bookingNumber: true, advanceAmount: true, paymentStatus: true },
  });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Idempotent: skip if already recorded.
  if (booking.paymentStatus !== "PAID" && booking.paymentStatus !== "PARTIALLY_PAID") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "PARTIALLY_PAID",
        amountPaid: new Prisma.Decimal(Number(booking.advanceAmount ?? 0)),
        razorpayPaymentId: razorpay_payment_id,
        confirmedAt: new Date(),
        status: "CONFIRMED",
      },
    });
  }

  return NextResponse.json({ ok: true, bookingNumber: booking.bookingNumber });
}
