import fs from "fs";
import path from "path";
import { FALLBACK_PRODUCTS } from "@/lib/seed";
import type { Product } from "@/lib/content";

export type ProductDataJson = {
  id: string;
  productName: string;
  slug: string;
  category: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  deliveryBadge: string;
  sku: string;
  images: string[];
  tags: string[];
  colors: string[];
  sizes: string[];
  variants: { label: string; options: string[] }[];
};

const PRODUCTS_ROOT = path.join(process.cwd(), "public", "products");

function readDataJson(slug: string): ProductDataJson | null {
  try {
    const filePath = path.join(PRODUCTS_ROOT, slug, "data.json");
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as ProductDataJson;
  } catch {
    return null;
  }
}

function scanImages(slug: string): string[] {
  const imagesDir = path.join(PRODUCTS_ROOT, slug, "images");
  const images: string[] = [];
  try {
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir).sort();
      for (const file of files) {
        if (/\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(file)) {
          images.push(`/products/${slug}/images/${file}`);
        }
      }
    }
  } catch {
    // ignore
  }
  return images;
}

function getThumbnail(slug: string): string | null {
  const thumbDir = path.join(PRODUCTS_ROOT, slug, "thumbnail");
  try {
    if (fs.existsSync(thumbDir)) {
      const files = fs.readdirSync(thumbDir).sort();
      for (const file of files) {
        if (/\.(jpg|jpeg|png|webp|gif|avif|svg)$/i.test(file)) {
          return `/products/${slug}/thumbnail/${file}`;
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

export function getProductFromFilesystem(slug: string): Product | null {
  const data = readDataJson(slug);
  if (!data) return null;

  const scannedImages = scanImages(slug);
  const thumbnail = getThumbnail(slug);

  const images: string[] = [];
  if (scannedImages.length > 0) {
    images.push(...scannedImages);
  }
  if (thumbnail && !images.includes(thumbnail)) {
    images.unshift(thumbnail);
  }
  if (images.length === 0) {
    images.push(`/products/${slug}/images/placeholder.gif`);
  }

  const variants: Array<{ label: string; options: string[] }> = [];
  if (data.variants && data.variants.length > 0) {
    variants.push(...data.variants);
  } else {
    if (data.colors && data.colors.length > 0) {
      variants.push({ label: "Color", options: data.colors });
    }
    if (data.sizes && data.sizes.length > 0) {
      variants.push({ label: "Size", options: data.sizes });
    }
  }

  return {
    id: data.id,
    name: data.productName,
    slug: data.slug,
    shortDesc: data.shortDesc,
    description: data.description,
    basePrice: data.comparePrice ?? data.price,
    salePrice: data.price < (data.comparePrice ?? data.price) ? data.price : null,
    sku: data.sku,
    stock: data.stock,
    rating: data.rating,
    reviewCount: data.reviewCount,
    isFeatured: data.isFeatured,
    deliveryBadge: data.deliveryBadge,
    categoryId: data.categoryId,
    images,
    tags: data.tags,
    variants,
  };
}

export function getProduct(slug: string): Product {
  const fsProduct = getProductFromFilesystem(slug);
  if (fsProduct) return fsProduct;

  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (fallback) return fallback;

  throw new Error(`Product not found: ${slug}`);
}

export function getAllProducts(): Product[] {
  const products: Product[] = [];
  const seen = new Set<string>();

  try {
    if (fs.existsSync(PRODUCTS_ROOT)) {
      const folders = fs.readdirSync(PRODUCTS_ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const folder of folders) {
        const p = getProductFromFilesystem(folder.name);
        if (p) {
          products.push(p);
          seen.add(p.slug);
        }
      }
    }
  } catch {
    // ignore
  }

  for (const p of FALLBACK_PRODUCTS) {
    if (!seen.has(p.slug)) {
      products.push(p);
      seen.add(p.slug);
    }
  }

  return products;
}

export function getAllProductSlugs(): string[] {
  const slugs = new Set<string>();

  try {
    if (fs.existsSync(PRODUCTS_ROOT)) {
      const folders = fs.readdirSync(PRODUCTS_ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory());
      for (const folder of folders) {
        if (fs.existsSync(path.join(PRODUCTS_ROOT, folder.name, "data.json"))) {
          slugs.add(folder.name);
        }
      }
    }
  } catch {
    // ignore
  }

  for (const p of FALLBACK_PRODUCTS) {
    slugs.add(p.slug);
  }

  return Array.from(slugs);
}
