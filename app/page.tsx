import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/home/hero";
import { OffersHighlight } from "@/components/home/offers-highlight";
import { FeaturesBar } from "@/components/home/features-bar";
import { Newsletter } from "@/components/home/newsletter";
import { Skeleton } from "@/lib/image-utils";
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

// Below-the-fold sections load as separate JS chunks, fetched only when the
// client reaches them — the initial bundle stays lean (Hero + OffersHighlight
// + FeaturesBar render first paint). Each gets a shimmer placeholder matching
// its natural height so nothing shifts when the chunk arrives.
const section = {
  flowerBouquets: dynamic(() =>
    import("@/components/home/flower-bouquets").then((m) => m.FlowerBouquetsSection),
    { loading: () => <Skeleton className="h-72 w-full" /> },
  ),
  categoryGrid: dynamic(() =>
    import("@/components/home/category-grid").then((m) => m.CategoryGrid),
    { loading: () => <Skeleton className="h-80 w-full" /> },
  ),
  featuredProducts: dynamic(() =>
    import("@/components/home/featured-products").then((m) => m.FeaturedProducts),
    { loading: () => <Skeleton className="h-96 w-full" /> },
  ),
  gallery: dynamic(() =>
    import("@/components/home/gallery-preview").then((m) => m.GalleryPreview),
    { loading: () => <Skeleton className="h-[480px] w-full" /> },
  ),
  whyChooseUs: dynamic(() =>
    import("@/components/home/why-choose-us").then((m) => m.WhyChooseUs),
    { loading: () => <Skeleton className="h-72 w-full" /> },
  ),
  reviewVideos: dynamic(() =>
    import("@/components/home/review-videos-carousel").then((m) => m.ReviewVideosCarousel),
    { loading: () => <Skeleton className="h-64 w-full" /> },
  ),
  testimonials: dynamic(() =>
    import("@/components/home/testimonials").then((m) => m.Testimonials),
    { loading: () => <Skeleton className="h-[420px] w-full" /> },
  ),
  homeInfo: dynamic(() =>
    import("@/components/home/home-info").then((m) => m.HomeInfoSection),
    { loading: () => <Skeleton className="h-72 w-full" /> },
  ),
};

export default async function HomePage() {
  const [products, bouquets, galleryRows, offerRows, reviewRows, productCats, serviceList] = await Promise.all([
    getStoreProducts({ featured: true, limit: 8 }),
    getStoreProducts({ categorySlug: "flower-bouquets", limit: 6 }),
    getGallery("all"),
    getOffers(),
    getReviewVideos({ limit: 12 }),
    getCategories("PRODUCT"),
    getServices(),
  ]);

  const collectImages = (rows: { slug: string; image?: string | null }[]) =>
    Object.fromEntries(
      rows.filter((r) => r.image && r.image.trim()).map((r) => [r.slug, r.image as string]),
    );
  const productImages = collectImages(productCats);

  const homeServices = serviceList.slice(0, 5).map((s) => ({
    slug: s.slug,
    name: s.name,
    subtitle: s.description,
    image: s.image ?? "",
  }));

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
      <section.flowerBouquets products={trim(bouquets)} />
      <FeaturesBar />
      <section.categoryGrid productImages={productImages} services={homeServices} />
      <section.featuredProducts products={trim(products)} />
      <section.gallery images={galleryImages} />
      <section.whyChooseUs />
      <section.reviewVideos videos={reviewVideos} googleReviewUrl={business.googleReviewUrl} />
      <section.testimonials />
      <section.homeInfo />
      <Newsletter />
    </>
  );
}
