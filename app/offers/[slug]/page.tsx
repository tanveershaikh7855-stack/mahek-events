import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getOfferBySlug, getStoreProducts } from "@/lib/data";
import { ProductCard } from "@/components/shop/product-card";
import { CopyCoupon } from "@/components/offers/copy-coupon";
import { business } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

function safeSrc(src: string): string {
  const s = src.trim();
  if (s.startsWith("data:") || s.startsWith("http")) return s;
  return s.startsWith("/") ? s : `/${s}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer) return { title: "Offer not found" };
  return {
    title: `${offer.title} | ${business.name}`,
    description: offer.subtitle ?? offer.description ?? undefined,
  };
}

export default async function OfferDetailPage({ params }: Props) {
  const { slug } = await params;
  const offer = await getOfferBySlug(slug);
  if (!offer || !offer.isActive) notFound();

  const products = offer.categorySlug
    ? await getStoreProducts({ categorySlug: offer.categorySlug, limit: 12 })
    : [];

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Banner */}
      <section className="relative">
        <div className="relative aspect-[16/10] sm:aspect-[16/7] lg:aspect-[16/6] bg-forest">
          {offer.image && (
            <Image
              src={safeSrc(offer.image)}
              alt={offer.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized={offer.image.startsWith("data:")}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-tight pb-6 md:pb-10">
              {offer.badge && (
                <span className="inline-block mb-3 rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {offer.badge}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                {offer.title}
              </h1>
              {offer.subtitle && (
                <p className="mt-2 max-w-xl text-sm sm:text-base text-white/85 drop-shadow">
                  {offer.subtitle}
                </p>
              )}
              {offer.discountLabel && (
                <span className="mt-3 inline-block rounded-full bg-gold px-4 py-1.5 text-sm font-bold text-white">
                  {offer.discountLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-tight py-8 md:py-12">
        {offer.description && (
          <p className="body-large max-w-2xl whitespace-pre-line">{offer.description}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          {offer.couponCode && <CopyCoupon code={offer.couponCode} />}
          {offer.ctaHref && (
            <Link
              href={offer.ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-hover"
            >
              {offer.ctaLabel || "Shop now"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-12">
            <h2 className="heading-card text-ink text-lg mb-5">Featured in this offer</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p as never} priority={i < 4} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
