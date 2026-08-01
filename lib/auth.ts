import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import { authConfig } from "./auth.config";
import { env, authSecret } from "./env";
import * as email from "./notifications/email";

/**
 * A bcrypt hash of a random string. Used to burn a constant amount of CPU when
 * the account does not exist, so response timing cannot be used to enumerate
 * which admin emails are valid.
 */
const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: authSecret,
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const normalizedEmail = email.trim().toLowerCase();

        // 1. Env-based bootstrap admin.
        //    ADMIN_PASSWORD_HASH holds a bcrypt *hash*. The old code compared
        //    the submitted password against a plaintext env var using
        //    bcrypt.compare(), which always returned false — meaning this
        //    branch could never succeed.
        if (
          env.ADMIN_EMAIL &&
          env.ADMIN_PASSWORD_HASH &&
          normalizedEmail === env.ADMIN_EMAIL.trim().toLowerCase()
        ) {
          const ok = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
          if (ok) {
            return {
              id: "env-admin",
              name: "Admin",
              email: normalizedEmail,
              role: "ADMIN" as const,
            };
          }
        }

        // 2. Database-backed staff accounts.
        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        // Always run a compare so the timing profile matches the found-user path.
        const ok = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
        if (!user || !user.isActive || !ok) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    /**
     * Storefront shopper accounts. Kept as a separate provider so a customer
     * record can never satisfy the admin credential path, and issued the
     * CUSTOMER role which lib/auth.config.ts refuses for /admin.
     */
    Credentials({
      id: "customer",
      name: "Customer",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.trim().toLowerCase();
        const customer = await prisma.customer.findUnique({ where: { email } });

        // Constant-time-ish: always compare, even when there is no such record
        // or the account has no password (created via checkout rather than
        // registration), so timing does not reveal which emails exist.
        const ok = await bcrypt.compare(
          parsed.data.password,
          customer?.password ?? DUMMY_HASH,
        );
        if (!customer || !customer.password || !ok) return null;

        return {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          role: "CUSTOMER" as const,
        };
      },
    }),
  ],
  events: {
    /**
     * Security notice on every successful admin sign-in. Deliberately not
     * awaited into the auth response path beyond a catch — a failing mail
     * provider must never block someone from logging in.
     */
    async signIn({ user }) {
      if (!user?.email) return;
      // Staff only — shoppers do not need a security notice on every sign-in.
      if (user.role !== "ADMIN" && user.role !== "STAFF") return;
      try {
        await email.sendLoginAlertEmail({
          email: user.email,
          name: user.name ?? "Admin",
          at: new Date(),
        });
      } catch (error) {
        console.error("[auth] login alert failed:", error);
      }
    },
  },
});

/**
 * Throws unless the caller is an authenticated admin/staff member.
 * Use at the top of every privileged server action and route handler —
 * middleware alone is not a sufficient authorization boundary.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") {
    throw new Error("Forbidden");
  }
  return session.user;
}
