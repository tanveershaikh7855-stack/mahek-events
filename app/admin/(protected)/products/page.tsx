import type { Metadata } from "next";
import { getAdminProducts, getAdminCategories } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { ProductsManager } from "@/components/admin/products-manager";
import type { VariantGroup, VariantOption } from "@/components/admin/shared/variants-editor";

function normalizeVariantsForEditor(raw: unknown): VariantGroup[] {
  if (!Array.isArray(raw)) return [];
  const out: VariantGroup[] = [];
  for (const g of raw) {
    if (!g || typeof g !== "object") continue;
    const label = String((g as { label?: unknown }).label ?? "").trim();
    const rawOptions = (g as { options?: unknown }).options;
    if (!label || !Array.isArray(rawOptions)) continue;
    const priceMap = (g as { optionPrices?: unknown }).optionPrices;
    const options: VariantOption[] = rawOptions
      .filter((o): o is string => typeof o === "string")
      .map((name) => {
        const p =
          priceMap && typeof priceMap === "object" && !Array.isArray(priceMap)
            ? Number((priceMap as Record<string, unknown>)[name])
            : NaN;
        return Number.isFinite(p) ? { name, price: p } : { name };
      });
    if (options.length) out.push({ label, options });
  }
  return out;
}

export const metadata: Metadata = { title: "Products | Mahek Admin", robots: "noindex" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAdminProducts(), getAdminCategories()]);

  const productRows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    advancePercent: p.advancePercent,
    stock: p.stock,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    shortDesc: p.shortDesc,
    description: p.description,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    variants: normalizeVariantsForEditor(p.variants),
    categoryId: p.categoryId,
    categoryName: p.category.name,
  }));

  const categoryRows = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    type: c.type,
    description: c.description,
    image: c.image,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productCount: c._count.products,
  }));

  return (
    <PageShell title="Products &amp; Categories">
      <ProductsManager products={productRows} categories={categoryRows} />
    </PageShell>
  );
}
