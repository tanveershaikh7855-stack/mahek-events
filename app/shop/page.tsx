import type { Metadata } from "next";
import { ShopPageClient } from "@/components/shop/shop-page-client";
import { seo, business } from "@/lib/content";
import { getStoreProducts, getStoreProductCategories } from "@/lib/data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: "Shop Helium Balloons, Bouquets & Party Supplies in Pune",
  description:
    "Buy premium helium balloons, balloon bouquets, chrome balloons, foil balloons & party supplies online. Same-day pickup from our Saras Baug shop, Pune. Delivery up to 70 KM.",
  alternates: { canonical: "/shop" },
  keywords: [
    "buy helium balloons Pune",
    "balloon shop Pune",
    "party supplies Pune",
    "balloon bouquets online Pune",
    "chrome balloons Pune",
    "foil balloons Pune",
    "helium balloon shop near Saras Baug",
  ],
  openGraph: {
    title: "Shop Helium Balloons & Party Supplies | Mahek Balloon Pune",
    description:
      "Premium helium balloons, bouquets & party supplies. Same-day pickup from Saras Baug, Pune.",
    url: "/shop",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: `${business.name} — Balloon Shop` }],
  },
};

export const revalidate = 3600;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getStoreProducts(),
    getStoreProductCategories(),
  ]);
  // The grid never renders the long description; omitting it keeps the RSC
  // payload for the whole catalogue small.
  const light = products.map((p) => ({ ...p, description: "" }));
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Shop", href: "/shop" }]} />
      <ShopPageClient products={light} categories={categories} />
    </>
  );
}