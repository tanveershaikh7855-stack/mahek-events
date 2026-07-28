import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Defence in depth. `middleware.ts` already blocks /admin, but this re-checks on
 * the server so a mistake in the middleware matcher cannot silently expose the
 * dashboard. Route group `(protected)` does not appear in the URL — the page
 * inside still serves /admin.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
