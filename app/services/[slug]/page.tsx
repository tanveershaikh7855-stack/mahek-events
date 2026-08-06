import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Calendar, Star } from "lucide-react";
import { getServiceBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ServiceJsonLd } from "@/components/seo/service-jsonld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  const title = `${service.name} in Pune — Starting ₹${service.priceFrom.toLocaleString("en-IN")} | Mahek Balloons`;
  const description = `${service.description} Professional setup within 70 KM of Pune. Book online, free consultation. Starting ₹${service.priceFrom.toLocaleString("en-IN")}.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${slug}` },
    keywords: [
      `${service.name.toLowerCase()} Pune`,
      `${service.name.toLowerCase()} near me`,
      "balloon decoration Pune",
      "event decoration Pune",
    ],
    openGraph: {
      title: `${service.name} in Pune | Mahek Balloons`,
      description: service.description,
      url: `/services/${slug}`,
      images: serviceImages[slug]
        ? [{ url: serviceImages[slug], width: 1200, height: 630, alt: service.name }]
        : [],
    },
  };
}

const serviceImages: Record<string, string> = {
  birthday: "/images/birthday-arch.png",
  wedding: "/images/wedding-room.png",
  corporate: "/images/balloon-wall.png",
  "baby-shower": "/images/baby-shower-arch.png",
  proposal: "/images/bouquet-box.png",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const heroImage = service.image || serviceImages[service.slug] || serviceImages.birthday;
  const galleryImages =
    service.images && service.images.length > 0
      ? service.images
      : [heroImage];

  return (
    <>
      <ServiceJsonLd
        name={service.name}
        slug={service.slug}
        description={service.description}
        priceFrom={service.priceFrom}
        image={heroImage}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <Image
          src={heroImage}
          alt={service.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container-tight">
          <Badge variant="secondary" className="mb-3">Decoration Service</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{service.name}</h1>
          <p className="text-white/80 max-w-xl">{service.description}</p>
        </div>
      </div>

      <section className="container-tight py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-ink mb-4">About This Service</h2>
            <p className="text-secondary-text leading-relaxed mb-8">{service.description}</p>

            <h3 className="text-xl font-semibold text-ink mb-4">What&apos;s Included</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {service.features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                  <span className="text-secondary-text">{f}</span>
                </div>
              ))}
            </div>

            {galleryImages.length > 1 && (
              <>
                <h3 className="text-xl font-semibold text-ink mb-4">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((src, i) => (
                    <a
                      key={`${src}-${i}`}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary block group"
                    >
                      <Image
                        src={src}
                        alt={`${service.name} gallery ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border border-border bg-white card-soft">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-ink">{formatPrice(service.priceFrom)}</span>
                <span className="text-sm text-secondary-text">starting price</span>
              </div>
              <p className="text-sm text-secondary-text mb-6">Final pricing depends on venue size, theme complexity, and material requirements.</p>

              <div className="space-y-3 mb-6">
                {service.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-secondary-text">
                    <CheckCircle className="w-4 h-4 text-forest flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <Button size="lg" className="w-full bg-forest text-white hover:bg-forest/90 mb-3" asChild>
                <Link href={`/booking?service=${service.slug}`}>
                  Book Now <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href={`https://wa.me/919876543210?text=Hi! I want to know more about ${service.name} decoration.`} target="_blank" rel="noopener noreferrer">
                  Request Quote
                </Link>
              </Button>

              <div className="mt-6 pt-6 border-t border-border text-sm text-secondary-text space-y-3">
                <p>✅ Free site visit within Pune</p>
                <p>✅ Setup & takedown included</p>
                <p>✅ Premium materials guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
