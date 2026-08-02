import { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { OffersHighlight } from "@/components/home/offers-highlight";
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
import { ReviewVideosCarousel } from "@/components/home/review-videos-carousel";
import { seo, business } from "@/lib/content";
import { getStoreProducts, getGallery, getOffers, getReviewVideos, getCategories, getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Mahek Balloons — Premium Helium Balloon Decoration in Pune | Saras Baug",
  description: seo.metaDescription,
  alternates: { canonical: "/" },
};

// Cached HTML, rebuilt in the background. Admin writes call revalidatePath, so
// edits still appear immediately — without paying a Supabase round-trip on
// every single visit (which is what force-dynamic was doing).
export const revalidate = 3600;

export default async function HomePage() {
  const [products, bouquets, galleryRows, offerRows, reviewRows, productCats, serviceCats, serviceList] = await Promise.all([
    getStoreProducts({ featured: true, limit: 8 }),
    getStoreProducts({ categorySlug: "flower-bouquets", limit: 6 }),
    getGallery("all"),
    getOffers(),
    getReviewVideos({ limit: 12 }),
    getCategories("PRODUCT"),
    getCategories("SERVICE"),
    getServices(),
  ]);

  const collectImages = (rows: { slug: string; image?: string | null }[]) =>
    Object.fromEntries(
      rows.filter((r) => r.image && r.image.trim()).map((r) => [r.slug, r.image as string]),
    );
  const productImages = collectImages(productCats);
  const serviceImages = collectImages(serviceCats);

  const reviewVideos = reviewRows.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    eventType: r.eventType,
    rating: r.rating,
    reviewText: r.reviewText,
    videoUrl: r.videoUrl,
    poster: r.poster,
  }));

  // Only ship what the highlight strip renders (first + 3 tiles).
  const homeOffers = offerRows.slice(0, 4).map((o) => ({
    id: o.id,
    slug: o.slug,
    title: o.title,
    badge: o.badge,
    subtitle: o.subtitle,
    image: o.image,
    discountLabel: o.discountLabel,
    couponCode: o.couponCode,
    endDate: o.endDate ? o.endDate.toISOString() : null,
  }));

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
      <OffersHighlight offers={homeOffers} />
      <FlowerBouquetsSection products={trim(bouquets)} />
      <FeaturesBar />
      <CategoryGrid productImages={productImages} serviceImages={serviceImages} />
      <FeaturedProducts products={trim(products)} />
      <ServicesSection services={serviceList} />
      <GalleryPreview images={galleryImages} />
      <WhyChooseUs />
      <ReviewVideosCarousel videos={reviewVideos} googleReviewUrl={business.googleReviewUrl} />
      <Testimonials />
      <HomeInfoSection />
      <Newsletter />
    </>
  );
}