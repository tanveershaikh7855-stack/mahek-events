import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { cartPage, business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Shopping Cart | ${business.name}`,
  description: cartPage.emptyDescription,
};

export default function CartPage() {
  return <CartPageClient />;
}