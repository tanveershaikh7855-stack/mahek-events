import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/shop/product-detail-client";
import { getStoreProductBySlug, getStoreProducts } from "@/lib/data";
import { getProduct } from "@/lib/product-loader";
import { business } from "@/lib/content";
import { ProductJsonLd } from "@/components/seo/product-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { ProductReviews } from "@/components/shop/product-reviews";

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
 * Product pages are generated on-demand at first request and cached via ISR
 * (revalidate = 3600). Pre-generating all of them at build time flooded the
 * Supabase pooler with parallel queries and made Hostinger deploys fail.
 * Returning [] keeps every slug allowed but defers the render until a real
 * visitor hits it, so the build never touches the DB for these pages.
 */
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return { title: "Product Not Found" };
  const title = `${product.name} — Buy Online in Pune | ${business.name}`;
  const description = `${product.shortDesc} Available at Mahek Balloons, Saras Baug, Pune. Same-day pickup. Starting ₹${product.salePrice ?? product.basePrice}.`;
  return {
    title,
    description,
    alternates: { canonical: `/shop/${slug}` },
    keywords: [
      product.name.toLowerCase(),
      "buy balloons Pune",
      "balloon shop Pune",
      ...(product.tags ?? []),
    ],
    openGraph: {
      title: `${product.name} | ${business.name}`,
      description: product.shortDesc,
      url: `/shop/${slug}`,
      images: product.images[0]
        ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  // DB-backed related products from the same category, so admin edits appear
  // in the "Related Products" strip instead of the frozen fallback list.
  const all = await getStoreProducts();
  const related = all
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductJsonLd
        name={product.name}
        slug={product.slug}
        description={product.shortDesc || product.description}
        images={product.images}
        basePrice={product.basePrice}
        salePrice={product.salePrice}
        sku={product.sku}
        rating={product.rating}
        reviewCount={product.reviewCount}
        inStock={product.stock > 0}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Shop", href: "/shop" },
          { name: product.name, href: `/shop/${product.slug}` },
        ]}
      />
      <ProductDetailClient product={product as never} related={related as never} />
      <ProductReviews productId={product.id} slug={product.slug} />
    </>
  );
}
