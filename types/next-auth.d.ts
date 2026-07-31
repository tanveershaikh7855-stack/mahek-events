import type { DefaultSession } from "next-auth";

// Replaces the `(user as any).role` casts the old auth code relied on.
// CUSTOMER is a storefront shopper account and must never satisfy an admin
// check — see the `authorized` callback in lib/auth.config.ts.
type Role = "ADMIN" | "STAFF" | "CUSTOMER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export {};
