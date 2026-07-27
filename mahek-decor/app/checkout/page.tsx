import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

export const metadata: Metadata = {
  title: "Checkout | Mahek Decorator",
  description: "Secure checkout for premium helium balloons and party supplies. COD, UPI, and card payments accepted.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}