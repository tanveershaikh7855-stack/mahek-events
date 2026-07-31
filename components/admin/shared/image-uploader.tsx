"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Client-side image picker used across the admin.
 *
 * Images are downscaled in the browser (max 1600px, JPEG q0.82) and then POSTed
 * to /api/admin/media, which stores the bytes and hands back a short URL like
 * "/api/media/<id>". Only that URL is saved on the product/gallery row.
 *
 * An earlier version inlined the image as a base64 data URL instead. That put
 * the full image into the page HTML *and* the RSC payload — five photos added
 * ~600 KB to the homepage — and none of it was cacheable. The media route sets
 * an immutable cache header, so the bytes are fetched once and reused.
 *
 * Values are written newline-joined into a hidden input, so the existing server
 * actions keep working unchanged, and manually typed paths
 * (e.g. "/images/foo.webp") can still be mixed in.
 */

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

/** Downscales and re-encodes to keep uploads small. Returns a Blob to POST. */
async function compressToBlob(file: File): Promise<Blob> {
  // GIFs (animation) and SVGs don't survive canvas re-encoding — send as-is.
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  const dataUrl = await readAsDataUrl(file);
  const img = document.createElement("img");
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Could not read that image"));
    img.src = dataUrl;
  });

  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  // Flatten transparency onto white so PNGs with alpha don't turn black as JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  return blob ?? file;
}

async function uploadFile(file: File): Promise<string> {
  const blob = await compressToBlob(file);
  const body = new FormData();
  body.append("file", new File([blob], file.name, { type: blob.type || file.type }));

  const res = await fetch("/api/admin/media", { method: "POST", body });
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.error ?? "Upload failed");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file"));
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  name,
  defaultValue = [],
  multiple = true,
  label = "Images",
}: {
  name: string;
  defaultValue?: string[];
  multiple?: boolean;
  label?: string;
}) {
  const [images, setImages] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (next: string[]) => setImages(multiple ? next : next.slice(-1));

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        uploaded.push(await uploadFile(file));
      }
      commit(multiple ? [...images, ...uploaded] : uploaded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function addUrl() {
    const v = urlInput.trim();
    if (!v) return;
    commit(multiple ? [...images, v] : [v]);
    setUrlInput("");
  }

  function removeAt(i: number) {
    commit(images.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="text-xs font-medium text-ink block mb-1">{label}</label>

      <input type="hidden" name={name} value={images.join("\n")} readOnly />

      <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-3">
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-white group"
              >
                <Image
                  src={src}
                  alt={`Image ${i + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && multiple && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-forest text-white px-1.5 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium hover:bg-secondary disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 text-forest" />
            )}
            {busy ? "Processing…" : multiple ? "Upload images" : "Upload image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="text-[11px] text-secondary-text">or paste a path below</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-text" />
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="/images/example.webp or https://…"
              className="w-full rounded-lg border border-border bg-white pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-forest"
            />
          </div>
          <button
            type="button"
            onClick={addUrl}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            Add
          </button>
        </div>

        {error && <p className="text-[11px] text-red-600 mt-2">{error}</p>}
        {images.length === 0 && !error && (
          <p className="text-[11px] text-secondary-text mt-2">
            {multiple ? "The first image is used as the main thumbnail." : "No image selected yet."}
          </p>
        )}
      </div>
    </div>
  );
}
