import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

/**
 * Admin-only image upload. Returns a short, cacheable URL that gets stored on
 * the product/gallery row in place of the old inline base64 data URL.
 */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 8 MB" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const media = await prisma.media.create({
    data: { mimeType: file.type, data: bytes, size: bytes.length },
    select: { id: true },
  });

  return NextResponse.json({ url: `/api/media/${media.id}` });
}
