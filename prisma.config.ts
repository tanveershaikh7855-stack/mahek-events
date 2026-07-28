import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * CLI-only configuration (migrate, db push, studio, generate).
 *
 * `shadowDatabaseUrl`/`directUrl` matter on Supabase: the pooled connection on
 * port 6543 cannot hold the advisory locks migrations need, so migrations run
 * against DIRECT_URL (port 5432) while the app runtime uses the pooled
 * DATABASE_URL. Falls back to DATABASE_URL when DIRECT_URL is not set.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
