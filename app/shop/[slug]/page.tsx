import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/data";
import { getProduct, getAllProductSlugs } from "@/lib/product-loader";
import { business } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// DB-first (so admin edits show), falling back to the static/filesystem product.
async function loadProduct(slug: string) {
  const dbProduct = await getStoreProductBySlug(slug);
  if (dbProduct) return dbProduct;
  try {
    return getProduct(slug);
  } catch {
    return null;
  }
}

/**
 * Prerender every known product page at build time so a visitor never waits on
 * a cold Supabase round-trip. Slugs come from the database, falling back to the
 * bundled catalogue when the DB is unreachable during a build.
 */
export async function generateStaticParams() {
  try {
    const products = await getStoreProducts();
    if (products.length > 0) return products.map((p) => ({ slug: p.slug }));
  } catch {
    // fall through to the static catalogue
  }
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | ${business.name}`,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();
  return <ProductDetailClient product={product as never} />;
}
