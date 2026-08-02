import { getSiteUrl } from "@/lib/site-url";

interface Crumb {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  const base = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      ...items.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: `${base}${c.href}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
