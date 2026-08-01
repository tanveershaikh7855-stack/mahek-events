import crypto from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

/**
 * Issues a short-lived signature so the browser can upload a file straight to
 * Cloudinary — bypassing Vercel's ~4.5 MB request-body cap, which matters for
 * real customer videos.
 *
 * The API secret NEVER leaves the server: only the signature (a one-way hash of
 * `folder + timestamp + secret`) and the public api_key are returned. The route
 * is admin-gated, so only signed-in staff can obtain a signature. If Cloudinary
 * isn't configured it returns 501 and the uploader falls back to the built-in
 * Supabase-backed media store.
 */
export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 501 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "mahek-balloon";

  // Cloudinary signs the alphabetically-sorted params (excluding file/api_key)
  // concatenated with the secret. We only send folder + timestamp, so sign
  // exactly those.
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
