import { business, socials, seo } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Server-rendered JSON-LD. Two graphs:
 *  - LocalBusiness: name, address, geo, phone, rating, socials → helps the shop
 *    surface for local "balloon decoration Pune" style searches and in Maps.
 *  - WebSite with a SearchAction → enables Google's sitelinks search box so a
 *    searcher can query the site straight from the results page.
 *
 * All values come from the existing content config — nothing here is editable
 * data that gets changed; it only mirrors what's already set.
 */
export function StructuredData() {
  const base = getSiteUrl();

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#business`,
    name: business.name,
    description: seo.metaDescription,
    url: base,
    telephone: business.phoneFormatted,
    email: business.email,
    image: `${base}${seo.ogImage}`,
    logo: `${base}${seo.ogImage}`,
    priceRange: "₹₹",
    foundingDate: String(business.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.pincode,
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: { "@type": "GeoCoordinates", latitude: 18.5074, longitude: 73.8567 },
      geoRadius: (business.deliveryRadiusKm ?? 140) * 1000,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(business.rating),
      reviewCount: String(business.totalCustomers),
      bestRating: "5",
    },
    sameAs: [socials.instagram, socials.facebook, business.googleMapsUrl].filter(Boolean),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: business.name,
    publisher: { "@id": `${base}/#business` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
