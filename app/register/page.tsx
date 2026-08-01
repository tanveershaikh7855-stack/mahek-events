import { Suspense } from "react";
import type { Metadata } from "next";
import { CustomerAuthForm } from "@/components/auth/customer-auth-form";
import { business } from "@/lib/content";
import { features } from "@/lib/env";

export const metadata: Metadata = {
  title: `Create account | ${business.name}`,
  description: "Create an account to track orders and book decorations faster.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <CustomerAuthForm mode="register" googleEnabled={features.google} />
    </Suspense>
  );
}
