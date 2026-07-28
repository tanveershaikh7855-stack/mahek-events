import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

/**
 * Lazily-constructed PrismaClient.
 *
 * Prisma 7 requires a driver adapter — a bare `new PrismaClient()` throws at
 * runtime. Connection URLs also moved out of the schema, so the string is
 * supplied here.
 *
 * The client is built on first property access via a Proxy rather than at
 * import. This matters during `next build`: pages call data helpers wrapped in
 * `withFallback`, so if DATABASE_URL is absent the failure happens inside the
 * query (and is caught, serving static content) instead of crashing module
 * evaluation and failing the whole build.
 *
 * The global cache stops Next's dev hot-reload from opening a fresh pool on
 * every save until Postgres refuses new connections.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!env.DATABASE_URL) {
    // Surface a clear message when a query is actually attempted without a DB
    // configured. withFallback() catches this and serves static content.
    throw new Error(
      "DATABASE_URL is not set — database features are unavailable. " +
        "Set it in your host's environment variables.",
    );
  }

  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getClient(): PrismaClient {
  const existing = globalForPrisma.prisma;
  if (existing) return existing;

  const client = createClient();
  if (env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/**
 * Proxy that defers client construction until the first property is read
 * (e.g. `prisma.product`). Accessing any model/method triggers getClient().
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
