import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginClient } from "@/components/admin/admin-login-client";

export const metadata: Metadata = {
  title: "Admin Login | Mahek Balloon",
  robots: "noindex",
};

// Never prerender or cache — CSRF cookies must be issued per request, and
// caching an RSC response of a login page has caused CDN mixups on hcdn.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  // AdminLoginClient reads the `callbackUrl` query param via useSearchParams(),
  // which opts the subtree into client-side rendering and must sit behind a
  // Suspense boundary or prerendering fails.
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-background" aria-hidden="true" />}
    >
      <AdminLoginClient />
    </Suspense>
  );
}
