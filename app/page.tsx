import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FlowerBouquetsSection } from "@/components/home/flower-bouquets";
import { FeaturesBar } from "@/components/home/features-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { ServicesSection } from "@/components/home/services-section";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { HomeInfoSection } from "@/components/home/home-info";
import { seo } from "@/lib/content";
import { getStoreProducts, getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Premium Helium Balloons & Decoration Services",
  description: seo.metaDescription,
};

// Cached HTML, rebuilt in the background. Admin writes call revalidatePath, so
// edits still appear immediately — without paying a Supabase round-trip on
// every single visit (which is what force-dynamic was doing).
export const revalidate = 3600;

export default async function HomePage() {
  const [products, bouquets, galleryRows] = await Promise.all([
    getStoreProducts({ featured: true, limit: 8 }),
    getStoreProducts({ categorySlug: "flower-bouquets", limit: 6 }),
    getGallery("all"),
  ]);

  // Only what the preview grid actually renders. Passing every row (and every
  // long description) shipped the whole catalogue in the RSC payload.
  const galleryImages = galleryRows
    .filter((g) => g.image && g.image.trim())
    .slice(0, 12)
    .map((g) => ({
      id: String(g.id),
      image: g.image,
      title: g.title ?? "",
      category: g.category,
    }));

  // Card views never show the long description — drop it from the payload.
  const trim = <T extends { description: string }>(list: T[]) =>
    list.map((p) => ({ ...p, description: "" }));

  return (
    <>
      <Hero />
      <FlowerBouquetsSection products={trim(bouquets)} />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedProducts products={trim(products)} />
      <ServicesSection />
      <GalleryPreview images={galleryImages} />
      <WhyChooseUs />
      <Testimonials />
      <HomeInfoSection />
      <Newsletter />
    </>
  );
}