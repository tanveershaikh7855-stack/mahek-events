import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Serves an uploaded image. Content is immutable — a new upload gets a new id —
 * so this can be cached forever by the browser and the CDN. That is the whole
 * point of the Media table: pages reference a short URL instead of carrying
 * hundreds of KB of base64 in their HTML.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const media = await prisma.media.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });

  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
