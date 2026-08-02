import type { Metadata } from "next";
import { getAdminProducts, getAdminCategories } from "@/lib/admin/queries";
import { PageShell } from "@/components/admin/shell/page-shell";
import { ProductsManager } from "@/components/admin/products-manager";

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
