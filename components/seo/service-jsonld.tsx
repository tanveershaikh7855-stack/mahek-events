import { getSiteUrl } from "@/lib/site-url";
import { business } from "@/lib/content";

interface ServiceJsonLdProps {
  name: string;
  slug: string;
  description: string;
  priceFrom: number;
  image?: string;
}

export function ServiceJsonLd(s: ServiceJsonLdProps) {
  const base = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: `${base}/services/${s.slug}`,
    image: s.image ? (s.image.startsWith("http") ? s.image : `${base}${s.image}`) : undefined,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${base}/#business`,
      name: business.name,
      telephone: business.phoneFormatted,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address,
        addressLocality: business.city,
        addressRegion: business.state,
        postalCode: business.pincode,
        addressCountry: "IN",
      },
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 18.5074, longitude: 73.8567 },
      geoRadius: (business.deliveryRadiusKm ?? 70) * 1000,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: String(s.priceFrom),
      eligibleRegion: { "@type": "Place", name: "Pune, Maharashtra" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
