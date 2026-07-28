import type { DefaultSession } from "next-auth";

// Replaces the `(user as any).role` casts the old auth code relied on.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "STAFF";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "STAFF";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "STAFF";
  }
}

export {};
