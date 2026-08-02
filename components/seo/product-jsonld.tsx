import { getSiteUrl } from "@/lib/site-url";
import { business } from "@/lib/content";

interface ProductJsonLdProps {
  name: string;
  slug: string;
  description: string;
  images: string[];
  basePrice: number;
  salePrice: number | null;
  sku: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

export function ProductJsonLd(p: ProductJsonLdProps) {
  const base = getSiteUrl();

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((img) =>
      img.startsWith("http") ? img : `${base}${img}`,
    ),
    sku: p.sku,
    url: `${base}/shop/${p.slug}`,
    brand: { "@type": "Brand", name: business.name },
    offers: {
      "@type": "Offer",
      url: `${base}/shop/${p.slug}`,
      priceCurrency: "INR",
      price: String(p.salePrice ?? p.basePrice),
      ...(p.salePrice
        ? { priceValidUntil: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10) }
        : {}),
      availability: p.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: business.name },
    },
  };

  if (p.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(p.rating),
      reviewCount: String(p.reviewCount),
      bestRating: "5",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
