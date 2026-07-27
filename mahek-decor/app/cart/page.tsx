import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Shopping Cart | Mahek Decorator",
  description: "Review your items and proceed to checkout. Premium helium balloons and party supplies.",
};

export default function CartPage() {
  return <CartPageClient />;
}