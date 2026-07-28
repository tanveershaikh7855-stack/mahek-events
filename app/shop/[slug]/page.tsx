import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { FALLBACK_PRODUCTS } from "@/lib/seed";
import { formatPrice } from "@/lib/utils";
import { business } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | ${business.name}`,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: [product.images[0]],
    },
  };
}

export async function generateStaticParams() {
  return FALLBACK_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return <ProductDetailClient product={product as any} />;
}