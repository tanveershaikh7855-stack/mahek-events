// Passthrough. The auth guard lives in app/admin/(protected)/layout.tsx so that
// /admin/login — which must stay reachable while signed out — is not wrapped by
// it. Guarding here instead would redirect the login page to itself forever.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
