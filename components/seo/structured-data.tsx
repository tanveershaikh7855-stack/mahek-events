import { business, socials, seo } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Server-rendered JSON-LD. Two graphs:
 *  - Organization (via LocalBusiness): the `logo` field points at the real
 *    logo file so Google can use it as the brand icon next to search results.
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
    // A florist-adjacent decoration store — the more specific types help Google
    // classify the business for "balloon decoration"/"party store" queries.
    "@type": ["Organization", "LocalBusiness", "Store"],
    "@id": `${base}/#business`,
    name: business.name,
    // Singular form kept as the alternate so searches for "Mahek Balloon" still
    // resolve to the business.
    alternateName: "Mahek Balloon",
    description: seo.metaDescription,
    slogan: business.tagline,
    url: base,
    telephone: business.phoneFormatted,
    email: business.email,
    image: `${base}${seo.ogImage}`,
    // The actual square logo file (512×512) — Google uses this as the brand
    // icon in Search. seo.ogImage is a 1200×630 banner and must not go here.
    logo: `${base}/images/logo/logo.png`,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
    foundingDate: String(business.founded),
    keywords: seo.keywords.join(", "),
    knowsAbout: [
      "Helium balloon decoration",
      "Nitrogen balloon decoration",
      "Birthday decoration",
      "Wedding decoration",
      "Baby shower decoration",
      "Balloon bouquets",
      "Event decoration",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.pincode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: 18.5074, longitude: 73.8567 },
    hasMap: business.googleMapsUrl,
    // Both an explicit list of localities (strong for "<service> <area>"
    // searches) and the delivery radius.
    areaServed: [
      ...(business.serviceAreas ?? []).map((name) => ({
        "@type": "City",
        name: `${name}, Pune`,
      })),
      {
        "@type": "GeoCircle",
        geoMidpoint: { "@type": "GeoCoordinates", latitude: 18.5074, longitude: 73.8567 },
        geoRadius: (business.deliveryRadiusKm ?? 70) * 1000,
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Balloon Decoration Services",
      itemListElement: [
        "Helium Balloon Decoration",
        "Nitrogen Balloon Decoration",
        "Birthday Decoration",
        "Wedding & Anniversary Decoration",
        "Baby Shower Decoration",
        "Corporate Event Decoration",
        "Balloon Bouquets",
      ].map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name, areaServed: "Pune" },
      })),
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
