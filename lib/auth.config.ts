import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the auth setup.
 *
 * `middleware.ts` runs on the Edge runtime, which cannot load Prisma or bcrypt.
 * So the route-protection rules and JWT/session shaping live here (no Node
 * dependencies), and the Credentials provider — which needs both — lives in
 * `lib/auth.ts`, which only ever runs in Node.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [], // populated in lib/auth.ts
  callbacks: {
    /**
     * Single source of truth for who may reach /admin. Consumed by middleware.
     */
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const role = auth?.user?.role;
      // Customer accounts share the same session store as staff, so "logged in"
      // is not sufficient for /admin — the role has to be a staff role.
      const isStaff = role === "ADMIN" || role === "STAFF";
      const isAdminArea = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (isLoginPage) {
        // Bounce already-authenticated staff away from the login screen.
        return isStaff
          ? Response.redirect(new URL("/admin", request.nextUrl))
          : true;
      }

      if (isAdminArea) return isStaff;

      // Customer-only areas.
      if (pathname.startsWith("/account")) return Boolean(auth?.user);

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "STAFF";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
