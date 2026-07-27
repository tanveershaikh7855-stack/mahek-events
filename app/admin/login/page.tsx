import type { Metadata } from "next";
import { AdminLoginClient } from "@/components/admin/admin-login-client";

export const metadata: Metadata = {
  title: "Admin Login | Mahek Decorator",
  robots: "noindex",
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}