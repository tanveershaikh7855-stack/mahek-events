"use client";

import { useState, useMemo, useTransition } from "react";
import { toast } from "sonner";
import { Package, Search, Plus, Pencil, Loader2, FolderTree } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  saveProduct,
  deleteProduct,
  toggleProductActive,
  saveCategory,
  deleteCategory,
} from "@/lib/admin/actions";
import { ConfirmDelete, EmptyState } from "./shared/ui";
import { ImageUploader } from "./shared/image-uploader";
import { formatPrice, cn } from "@/lib/utils";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  basePrice: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  shortDesc: string | null;
  description: string | null;
  images: string[];
  categoryId: string;
  categoryName: string;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function ProductDialog({
  product,
  categories,
  open,
  onOpenChange,
}: {
  product: ProductRow | null;
  categories: CategoryRow[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            Changes go live on the storefront as soon as you save.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveProduct(product?.id ?? null, formData);
              if (res.ok) {
                toast.success(res.message ?? "Saved");
                onOpenChange(false);
              } else {
                toast.error(res.error);
              }
            })
          }
          className="space-y-4"
        >
          <div>
            <label className={labelCls}>Product name *</label>
            <input name="name" defaultValue={product?.name} required className={field} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category *</label>
              <select
                name="categoryId"
                defaultValue={product?.categoryId ?? categories[0]?.id}
                required
                className={field}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input name="sku" defaultValue={product?.sku ?? ""} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input
                name="basePrice"
                type="number"
                min={0}
                step="0.01"
                defaultValue={product?.basePrice}
                required
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Sale price (₹)</label>
              <input
                name="salePrice"
                type="number"
                min={0}
                step="0.01"
                defaultValue={product?.salePrice ?? ""}
                className={field}
              />
            </div>
            <div>
              <label className={labelCls}>Stock</label>
              <input
                name="stock"
                type="number"
                min={0}
                defaultValue={product?.stock ?? 0}
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Short description</label>
            <input
              name="shortDesc"
              maxLength={255}
              defaultValue={product?.shortDesc ?? ""}
              className={field}
            />
          </div>

          <div>
            <label className={labelCls}>Full description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description ?? ""}
              className={cn(field, "resize-none")}
            />
          </div>

          <ImageUploader
            name="images"
            label="Product images"
            defaultValue={product?.images ?? []}
            multiple
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={product?.isActive ?? true}
                className="rounded border-border"
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={product?.isFeatured ?? false}
                className="rounded border-border"
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-60"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              {product ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: CategoryRow | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [pending, start] = useTransition();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>Categories group products on the shop page.</DialogDescription>
        </DialogHeader>
        <form
          action={(formData) =>
            start(async () => {
              const res = await saveCategory(category?.id ?? null, formData);
              if (res.ok) {
                toast.success(res.message ?? "Saved");
                onOpenChange(false);
              } else {
                toast.error(res.error);
              }
            })
          }
          className="space-y-4"
        >
          <div>
            <label className={labelCls}>Name *</label>
            <input name="name" defaultValue={category?.name} required className={field} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select name="type" defaultValue={category?.type ?? "PRODUCT"} className={field}>
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
                <option value="EVENT">Event</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Sort order</label>
              <input
                name="sortOrder"
                type="number"
                defaultValue={category?.sortOrder ?? 0}
                className={field}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={category?.description ?? ""}
              className={cn(field, "resize-none")}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={category?.isActive ?? true}
              className="rounded border-border"
            />
            Active
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-60"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PublishToggle({ product }: { product: ProductRow }) {
  const [pending, start] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await toggleProductActive(product.id, !product.isActive);
          if (res.ok) toast.success(res.message ?? "Updated");
          else toast.error(res.error);
        })
      }
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors disabled:opacity-60",
        product.isActive
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {pending ? "…" : product.isActive ? "Live" : "Hidden"}
    </button>
  );
}

export function ProductsManager({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: CategoryRow[];
}) {
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [productOpen, setProductOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryRow | null>(null);
  const [catOpen, setCatOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku ?? "").toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-border">
        {(["products", "categories"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors",
              tab === t
                ? "border-forest text-forest"
                : "border-transparent text-secondary-text hover:text-ink",
            )}
          >
            {t} ({t === "products" ? products.length : categories.length})
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products by name, SKU or category"
                className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-forest"
              />
            </div>
            <button
              onClick={() => {
                setEditing(null);
                setProductOpen(true);
              }}
              disabled={categories.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              New product
            </button>
          </div>

          {categories.length === 0 && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              Create a category first — every product needs one.
            </p>
          )}

          {products.length === 0 ? (
            <EmptyState icon={Package} title="No products yet" hint="Add your first product." />
          ) : (
            <div className="rounded-2xl border border-border bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[760px]">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">
                        Product
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Stock</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">
                        Status
                      </th>
                      <th className="w-24" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{p.name}</p>
                          {p.sku && <p className="text-xs text-secondary-text">{p.sku}</p>}
                        </td>
                        <td className="px-4 py-3 text-secondary-text">{p.categoryName}</td>
                        <td className="px-4 py-3">
                          {p.salePrice ? (
                            <>
                              <span className="font-semibold text-ink">
                                {formatPrice(p.salePrice)}
                              </span>
                              <span className="text-xs text-secondary-text line-through ml-1.5">
                                {formatPrice(p.basePrice)}
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-ink">
                              {formatPrice(p.basePrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(p.stock <= 5 && "text-amber-600 font-semibold")}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <PublishToggle product={p} />
                        </td>
                        <td className="px-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditing(p);
                                setProductOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-secondary transition-colors"
                              aria-label="Edit"
                            >
                              <Pencil className="w-4 h-4 text-secondary-text" />
                            </button>
                            <ConfirmDelete
                              title={`Delete "${p.name}"?`}
                              description="This removes it from the storefront permanently."
                              onConfirm={() => deleteProduct(p.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setEditingCat(null);
                setCatOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-hover"
            >
              <Plus className="w-4 h-4" />
              New category
            </button>
          </div>

          {categories.length === 0 ? (
            <EmptyState
              icon={FolderTree}
              title="No categories yet"
              hint="Categories organise the shop page."
            />
          ) : (
            <div className="rounded-2xl border border-border bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[620px]">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">
                        Products
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">Order</th>
                      <th className="text-left px-4 py-3 font-medium text-secondary-text">
                        Status
                      </th>
                      <th className="w-24" />
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <p className="font-medium text-ink">{c.name}</p>
                          <p className="text-xs text-secondary-text">{c.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-secondary-text">{c.type}</td>
                        <td className="px-4 py-3 text-ink">{c.productCount}</td>
                        <td className="px-4 py-3 text-secondary-text">{c.sortOrder}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-xs font-medium border",
                              c.isActive
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-600 border-gray-200",
                            )}
                          >
                            {c.isActive ? "Active" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingCat(c);
                                setCatOpen(true);
                              }}
                              className="p-2 rounded-lg hover:bg-secondary transition-colors"
                              aria-label="Edit"
                            >
                              <Pencil className="w-4 h-4 text-secondary-text" />
                            </button>
                            <ConfirmDelete
                              title={`Delete "${c.name}"?`}
                              description="Categories holding products cannot be deleted."
                              onConfirm={() => deleteCategory(c.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <ProductDialog
        key={editing?.id ?? "new-product"}
        product={editing}
        categories={categories}
        open={productOpen}
        onOpenChange={setProductOpen}
      />
      <CategoryDialog
        key={editingCat?.id ?? "new-category"}
        category={editingCat}
        open={catOpen}
        onOpenChange={setCatOpen}
      />
    </div>
  );
}
