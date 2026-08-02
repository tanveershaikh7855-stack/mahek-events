import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Tag } from "lucide-react";
import { getOffers } from "@/lib/data";
import { business, seo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Balloon Decoration Offers & Deals in Pune | Mahek Balloon",
  description:
    "Exclusive offers on helium balloon decoration, party supplies & event packages in Pune. Save on birthday, wedding & celebration decor. Limited-time deals from Mahek Balloon.",
  alternates: { canonical: "/offers" },
  keywords: [
    "balloon decoration offers Pune",
    "balloon deals Pune",
    "party supplies discount Pune",
    "decoration package offers",
  ],
  openGraph: {
    title: "Offers & Deals | Mahek Balloon Pune",
    description: "Seasonal and exclusive offers on balloon décor and celebration packages.",
    url: "/offers",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: "Mahek Balloon Offers" }],
  },
};

export const revalidate = 3600;

function safeSrc(src: string): string {
  const s = src.trim();
  if (s.startsWith("data:") || s.startsWith("http")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export default async function OffersPage() {
  const offers = await getOffers();

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
        <div className="container-tight">
          <span className="section-label mb-3 inline-flex">
            <Sparkles className="w-3.5 h-3.5" /> Offers
          </span>
          <h1 className="heading-section text-ink">Current Offers</h1>
          <p className="body-large mt-3 max-w-xl">
            Seasonal deals and exclusive savings on balloons, bouquets and full décor setups.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-tight">
          {offers.length === 0 ? (
            <div className="text-center py-20">
              <Tag className="w-16 h-16 mx-auto text-border mb-4" />
              <h3 className="text-xl font-semibold text-ink mb-2">No live offers right now</h3>
              <p className="text-secondary-text">Check back soon for seasonal deals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map((offer) => (
                <Link
                  key={offer.id}
                  href={`/offers/${offer.slug}`}
                  className="group rounded-3xl overflow-hidden border border-border bg-white card-lift"
                >
                  <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
                    {offer.image ? (
                      <Image
                        src={safeSrc(offer.image)}
                        alt={offer.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={offer.image.startsWith("data:")}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-forest/5">
                        <Sparkles className="w-10 h-10 text-forest/40" />
                      </div>
                    )}
                    {offer.badge && (
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-forest">
                        {offer.badge}
                      </span>
                    )}
                    {offer.discountLabel && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-white">
                        {offer.discountLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-heading text-lg font-bold text-ink">{offer.title}</h2>
                    {offer.subtitle && (
                      <p className="text-sm text-secondary-text mt-1 line-clamp-2">
                        {offer.subtitle}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                      View offer
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
