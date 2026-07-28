import { Metadata } from "next";
import { MATERIAL_CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { business } from "@/lib/content";

export const metadata: Metadata = {
  title: `Decorative Materials | ${business.name}`,
  description:
    "Browse premium decorative materials — balloons, flower stands, metal frames, LED numbers, lighting, stage props and more for birthdays, weddings and corporate events.",
};

export default function MaterialsPage() {
  return (
    <main className="min-h-screen pt-16 md:pt-18 bg-background">
      <section className="section-spacing">
        <div className="container-tight">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="label text-gold mb-3 block">Our Collection</span>
            <h1 className="heading-hero text-ink mb-5">Decorative Materials</h1>
            <p className="body-large text-secondary-text max-w-2xl mx-auto">
              From helium balloons to wedding thrones, curated decorative materials
              for every celebration. Browse by category and find exactly what you
              need.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {MATERIAL_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/materials/${category.slug}`}
                className="group block relative overflow-hidden rounded-2xl bg-white border border-border p-4 md:p-5 text-center card-lift hover:border-forest/30"
              >
                <div className="text-3xl md:text-4xl mb-3">{category.icon}</div>
                <h3 className="text-sm md:text-[0.9375rem] font-semibold text-ink mb-1">
                  {category.name}
                </h3>
                <p className="text-xs md:text-[0.8125rem] text-secondary-text line-clamp-2">
                  {category.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-forest text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Browse <ArrowRightMini />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ArrowRightMini() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-forest"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}