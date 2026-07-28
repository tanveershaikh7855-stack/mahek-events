import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Mahek Balloon",
  robots: "noindex",
};

export default function AdminPage() {
  return <AdminDashboard />;
}