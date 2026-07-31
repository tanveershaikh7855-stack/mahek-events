import { auth } from "@/lib/auth";
import { getNavCounts } from "@/lib/admin/queries";
import { AdminShell } from "./admin-shell";

/**
 * Server wrapper: pulls the session + live nav counts once, then hands them to
 * the client shell. Pages render `<PageShell title="…">content</PageShell>`.
 */
export async function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [session, counts] = await Promise.all([auth(), getNavCounts()]);
  const user = session?.user ?? { name: "Admin", email: "" };

  return (
    <AdminShell counts={counts} user={user} title={title}>
      {children}
    </AdminShell>
  );
}
