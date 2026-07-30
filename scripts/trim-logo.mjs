/**
 * Trims the baked-in white padding from the brand logo and emits a compact,
 * transparent PNG.
 *
 *   node scripts/trim-logo.mjs
 *
 * The source logo.png is 1536x1024 with the mark floating in a large white
 * field, so `h-[36px] w-auto` in the header rendered a mostly-empty box and
 * shipped ~1.1 MB. Trimming makes the logo fill its box and cuts the payload.
 * The original is kept as logo-original.png.
 */
import sharp from "sharp";
import { existsSync, copyFileSync } from "node:fs";

const dir = "public/images/logo";
const src = `${dir}/logo.png`;
const backup = `${dir}/logo-original.png`;

if (!existsSync(backup)) copyFileSync(src, backup);

const before = await sharp(backup).metadata();

// Make the white field transparent, then trim to the ink bounding box.
const { data, info } = await sharp(backup)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const WHITE = 244; // treat near-white as background
for (let i = 0; i < data.length; i += channels) {
  if (data[i] >= WHITE && data[i + 1] >= WHITE && data[i + 2] >= WHITE) {
    data[i + 3] = 0;
  }
}

await sharp(data, { raw: { width, height, channels } })
  .trim({ threshold: 1 })
  .png({ compressionLevel: 9, palette: true })
  .toFile(src);

const after = await sharp(src).metadata();
console.log(`logo: ${before.width}x${before.height} -> ${after.width}x${after.height}`);
