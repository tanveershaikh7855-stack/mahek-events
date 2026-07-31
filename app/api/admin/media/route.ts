import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
// Vercel serverless functions reject request bodies over ~4.5 MB, so a gallery
// video has to be a short, compressed clip. Anything bigger belongs on YouTube
// with a link, not uploaded here.
const MAX_VIDEO_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm", "video/quicktime"]);

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

  const isImage = ALLOWED_IMAGE.has(file.type);
  const isVideo = ALLOWED_VIDEO.has(file.type);
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Unsupported file type — use JPG/PNG/WebP images or MP4/WebM video" },
      { status: 400 },
    );
  }
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video is over 4 MB. Use a short, compressed clip (or link a YouTube video instead)."
          : "Image is over 4 MB. It should be well under this after resizing.",
      },
      { status: 413 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const media = await prisma.media.create({
    data: { mimeType: file.type, data: bytes, size: bytes.length },
    select: { id: true },
  });

  return NextResponse.json({ url: `/api/media/${media.id}`, kind: isVideo ? "video" : "image" });
}
