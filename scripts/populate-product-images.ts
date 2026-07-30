/**
 * Copies each product's matched real photos (from lib/content.ts) into its
 * uipro folder public/products/<slug>/images/ and /thumbnail/, so the
 * filesystem-backed product detail pages show the same real images as the grid.
 *
 *   npx tsx scripts/populate-product-images.ts
 */
import fs from "fs";
import path from "path";
import { products } from "../lib/content";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const PRODUCTS = path.join(PUBLIC, "products");

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return;
  }
  for (const f of fs.readdirSync(dir)) fs.rmSync(path.join(dir, f), { force: true });
}

let done = 0;
let missing = 0;

for (const product of products) {
  const dir = path.join(PRODUCTS, product.slug);
  if (!fs.existsSync(dir)) {
    console.warn(`  no folder for ${product.slug} — skipped`);
    continue;
  }

  const imagesDir = path.join(dir, "images");
  const thumbDir = path.join(dir, "thumbnail");
  emptyDir(imagesDir);
  emptyDir(thumbDir);

  let index = 0;
  for (const rel of product.images) {
    const src = path.join(PUBLIC, rel.replace(/^\//, ""));
    if (!fs.existsSync(src)) {
      console.warn(`  missing source ${rel} for ${product.slug}`);
      missing++;
      continue;
    }
    index++;
    const ext = path.extname(src);
    fs.copyFileSync(src, path.join(imagesDir, `${index}${ext}`));
    // First image doubles as the thumbnail.
    if (index === 1) fs.copyFileSync(src, path.join(thumbDir, `cover${ext}`));
  }

  if (index === 0) {
    // Keep a placeholder so the folder is never empty.
    fs.writeFileSync(path.join(imagesDir, "placeholder.gif"), "");
  }
  done++;
}

console.log(`Populated ${done} products (${missing} missing sources).`);
