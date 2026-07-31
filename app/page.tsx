import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { DecorativeMaterialsSection } from "@/components/home/decorative-materials";
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
import { getStoreProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Premium Helium Balloons & Decoration Services",
  description: seo.metaDescription,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getStoreProducts({ featured: true, limit: 8 });

  return (
    <>
      <Hero />
      <DecorativeMaterialsSection />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedProducts products={products} />
      <ServicesSection />
      <GalleryPreview />
      <WhyChooseUs />
      <Testimonials />
      <HomeInfoSection />
      <Newsletter />
    </>
  );
}