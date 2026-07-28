import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Route protection for /admin.
 *
 * Named `proxy.ts` rather than `middleware.ts` — Next 16 deprecated the
 * middleware file convention in favour of this one.
 *
 * Uses only the edge-safe config (no Prisma, no bcrypt); the `authorized`
 * callback in lib/auth.config.ts decides what is protected.
 */
export const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  matcher: [
    /**
     * Everything except Next internals, the auth endpoints themselves, and
     * static assets — matching /api/auth would break the sign-in round trip.
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico)$).*)",
  ],
};
