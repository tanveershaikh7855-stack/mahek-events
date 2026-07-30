import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { getProduct, getAllProductSlugs } from "@/lib/product-loader";
import { business } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let product;
  try {
    product = getProduct(slug);
  } catch {
    return { title: "Product Not Found" };
  }
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
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product: ReturnType<typeof getProduct>;
  try {
    product = getProduct(slug);
  } catch {
    notFound();
  }
  return <ProductDetailClient product={product as any} />;
}