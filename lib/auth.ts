import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { loginSchema } from "./validators";
import { authConfig } from "./auth.config";
import { env, authSecret } from "./env";

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
          return null;
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
  ],
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
