import { Metadata } from "next";
import { MATERIAL_CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return MATERIAL_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const category = MATERIAL_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) return { title: "Material Not Found" };
  return {
    title: `${category.name} | Mahek Decorator`,
    description: category.description,
  };
}

export default function MaterialCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = MATERIAL_CATEGORIES.find((c) => c.slug === params.slug);
  if (!category) notFound();

  return (
    <main className="min-h-screen pt-16 md:pt-18 bg-background">
      <section className="section-spacing">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="heading-hero text-ink">{category.name}</h1>
              <p className="body-large text-secondary-text mt-1">
                {category.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-white p-6 text-center text-secondary-text"
              >
                <p>Product listing for {category.name}</p>
                <p className="text-sm mt-2 text-muted-foreground">
                  Coming soon — products for this category will be available
                  shortly.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}