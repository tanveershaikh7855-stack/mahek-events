import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import { checkoutPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `${checkoutPage.title} | ${business.name}`,
  description: checkoutPage.secureNote,
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}