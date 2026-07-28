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
import { seo, business } from "@/lib/content";

export const metadata: Metadata = {
  title: "Premium Helium Balloons & Decoration Services",
  description: seo.metaDescription,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <DecorativeMaterialsSection />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedProducts />
      <ServicesSection />
      <GalleryPreview />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}