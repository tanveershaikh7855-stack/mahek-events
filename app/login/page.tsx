import { Suspense } from "react";
import type { Metadata } from "next";
import { CustomerAuthForm } from "@/components/auth/customer-auth-form";
import { business } from "@/lib/content";
import { features } from "@/lib/env";

export const metadata: Metadata = {
  title: `Sign in | ${business.name}`,
  description: "Sign in to track your orders, bookings and wishlist.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <CustomerAuthForm mode="login" googleEnabled={features.google} />
    </Suspense>
  );
}
