import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { getStoreProductBySlug } from "@/lib/data";
import { getProduct } from "@/lib/product-loader";
import { business } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

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
