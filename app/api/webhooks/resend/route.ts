import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env, features } from "@/lib/env";

/**
 * Resend webhook handler. Logs delivery events (bounced, complained, delivered)
 * so the admin can diagnose email failures from server logs. The webhook secret
 * verifies that events really come from Resend (Svix signature).
 *
 * Setup: Resend dashboard → Webhooks → Add endpoint →
 *   URL: https://mahekballoons.com/api/webhooks/resend
 *   Events: email.delivered, email.bounced, email.complained
 *   Copy the signing secret into RESEND_WEBHOOK_SECRET.
 */
export async function POST(req: NextRequest) {
  if (!features.resendWebhook) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }

  const body = await req.text();
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing svix headers" }, { status: 400 });
  }

  const secret = env.RESEND_WEBHOOK_SECRET!;
  const secretBytes = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const toSign = `${svixId}.${svixTimestamp}.${body}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(toSign).digest("base64");

  const signatures = svixSignature.split(" ");
  const valid = signatures.some((sig) => {
    const val = sig.startsWith("v1,") ? sig.slice(3) : sig;
    try {
      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(val));
    } catch {
      return false;
    }
  });

  if (!valid) {
    console.warn("[resend webhook] signature mismatch");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const type: string = event.type ?? "unknown";
  const to: string = event.data?.to?.[0] ?? "?";

  switch (type) {
    case "email.bounced":
      console.error(`[resend] BOUNCED to=${to} reason=${event.data?.bounce?.type ?? "?"}`);
      break;
    case "email.complained":
      console.warn(`[resend] COMPLAINT to=${to}`);
      break;
    case "email.delivered":
      console.info(`[resend] delivered to=${to}`);
      break;
    default:
      console.info(`[resend] event=${type} to=${to}`);
  }

  return NextResponse.json({ ok: true });
}
