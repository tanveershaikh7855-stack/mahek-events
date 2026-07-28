import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { features } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment smoke test. Answers "is the database actually reachable and which
 * integrations are live?" — previously there was no way to tell a working
 * deployment from one silently serving static fallback content.
 */
export async function GET() {
  const started = Date.now();

  let database: "up" | "down" = "down";
  let databaseError: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch (error) {
    databaseError = error instanceof Error ? error.message : "unknown error";
  }

  const body = {
    status: database === "up" ? "ok" : "degraded",
    database,
    databaseError,
    integrations: features,
    latencyMs: Date.now() - started,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status: database === "up" ? 200 : 503 });
}
