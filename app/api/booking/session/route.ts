import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRazorpay, toPaise } from "@/lib/razorpay";
import { features, env } from "@/lib/env";

export const runtime = "nodejs";

const bodySchema = z.object({ bookingId: z.string().min(1) });

/**
 * Creates a Razorpay order for a product booking's 50% advance. The amount is
 * read from the booking row (never the request), mirroring the checkout flow.
 */
export async function POST(request: Request) {
  if (!features.razorpay) {
    return NextResponse.json(
      { error: "Online payment is not available right now." },
      { status: 503 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: parsed.data.bookingId },
    select: {
      id: true,
      bookingNumber: true,
      advanceAmount: true,
      paymentStatus: true,
      razorpayOrderId: true,
      customerName: true,
      customerPhone: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  const advance = Number(booking.advanceAmount ?? 0);
  if (advance <= 0) {
    return NextResponse.json({ error: "No advance is due for this booking" }, { status: 400 });
  }
  if (booking.paymentStatus === "PAID" || booking.paymentStatus === "PARTIALLY_PAID") {
    return NextResponse.json({ error: "This booking is already paid" }, { status: 409 });
  }

  const razorpay = requireRazorpay();
  try {
    const rzpOrder =
      booking.razorpayOrderId ??
      (
        await razorpay.orders.create({
          amount: toPaise(advance),
          currency: "INR",
          receipt: booking.bookingNumber,
          notes: { bookingId: booking.id, bookingNumber: booking.bookingNumber },
        })
      ).id;

    if (!booking.razorpayOrderId) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { razorpayOrderId: rzpOrder },
      });
    }

    return NextResponse.json({
      razorpayOrderId: rzpOrder,
      keyId: env.RAZORPAY_KEY_ID,
      amount: toPaise(advance),
      currency: "INR",
      name: "Mahek Balloons",
      description: `Advance for booking ${booking.bookingNumber}`,
      prefill: {
        name: booking.customerName ?? "",
        contact: booking.customerPhone ?? "",
      },
    });
  } catch (error) {
    console.error("[booking/session] Razorpay error:", error);
    return NextResponse.json({ error: "Could not start payment." }, { status: 502 });
  }
}
