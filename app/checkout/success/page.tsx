import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed | Mahek Balloon",
  robots: "noindex",
};

// Always read fresh — the webhook may land moments after the redirect.
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      total: true,
      amountPaid: true,
      balanceDue: true,
      paymentStatus: true,
    },
  });

  if (!order) notFound();

  // The webhook is the source of truth. If it has not arrived yet we say so
  // rather than claiming a confirmation we cannot verify.
  const confirmed =
    order.paymentStatus === "PARTIALLY_PAID" || order.paymentStatus === "PAID";

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="container-tight py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center p-8 rounded-2xl border border-border bg-white">
          <div
            className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              confirmed ? "bg-green-100" : "bg-amber-100"
            }`}
          >
            {confirmed ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Clock className="w-8 h-8 text-amber-600" />
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2">
            {confirmed ? "Payment Received" : "Processing Payment"}
          </h1>
          <p className="text-sm font-mono text-forest mb-6">{order.orderNumber}</p>

          {confirmed ? (
            <div className="text-left space-y-2 text-sm mb-6 p-4 rounded-xl bg-secondary">
              <div className="flex justify-between">
                <span className="text-secondary-text">Order total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Advance paid</span>
                <span>{formatPrice(Number(order.amountPaid))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-text">Balance on delivery</span>
                <span>{formatPrice(Number(order.balanceDue))}</span>
              </div>
            </div>
          ) : (
            <p className="text-secondary-text mb-6">
              Your payment is still being confirmed by our provider. This usually takes a few
              seconds — refresh this page shortly. We&apos;ll email you as soon as it clears.
            </p>
          )}

          <Button className="bg-forest text-white hover:bg-forest/90" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
