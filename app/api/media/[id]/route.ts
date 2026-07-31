import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Serves an uploaded image or video. Content is immutable — a new upload gets a
 * new id — so it can be cached forever. Videos are requested with a `Range`
 * header by the browser for seeking, so a byte-range request is answered with a
 * 206 partial response; anything else returns the whole object.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const media = await prisma.media.findUnique({
    where: { id },
    select: { data: true, mimeType: true, size: true },
  });

  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = Buffer.from(media.data);
  const total = buffer.length;
  const range = request.headers.get("range");

  const baseHeaders: Record<string, string> = {
    "Content-Type": media.mimeType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    if (match) {
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : total - 1;
      if (start >= total || end >= total || start > end) {
        return new NextResponse("Range Not Satisfiable", {
          status: 416,
          headers: { "Content-Range": `bytes */${total}` },
        });
      }
      const chunk = buffer.subarray(start, end + 1);
      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Range": `bytes ${start}-${end}/${total}`,
          "Content-Length": String(chunk.length),
        },
      });
    }
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: { ...baseHeaders, "Content-Length": String(total) },
  });
}
