import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

/**
 * Single PrismaClient instance.
 *
 * Prisma 7 requires a driver adapter (or Accelerate) — a bare
 * `new PrismaClient()` as the old code used throws at runtime because there is
 * no engine to connect with. Connection URLs also moved out of the schema, so
 * the string is supplied here rather than read implicitly.
 *
 * The global cache prevents Next's dev hot-reload from opening a fresh
 * connection pool on every file save until Postgres refuses new connections.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
