import { ADMIN_PRODUCT_FIELDS as F } from "@/features/products/schemas/admin-product";

export const PRODUCT_INPUT_CLASS =
  "border-surface-700 bg-surface-900 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent h-11 w-full rounded-md border px-4 text-sm";

export const PRODUCT_CHECKBOX_CLASS =
  "accent-accent border-surface-600 bg-surface-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent h-4 w-4 rounded";

export const PRODUCT_CANCEL_CLASS =
  "border-surface-700 text-surface-300 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent inline-flex h-11 items-center rounded border px-6 text-xs font-black uppercase tracking-[0.12em]";

export const PRODUCT_CORE_FIELDS = [
  { key: F.name, id: "product-name", label: "Name" },
  { key: F.slug, id: "product-slug", label: "Slug" },
  { key: F.sku, id: "product-sku", label: "SKU" },
  { key: F.description, id: "product-description", label: "Description" },
] as const;

export const PRODUCT_NUMBER_FIELDS = [
  { key: F.priceEgp, id: "product-price", label: "Price (EGP)", step: "0.01", required: true },
  {
    key: F.compareAtPrice,
    id: "product-compare",
    label: "Compare-at price",
    step: "0.01",
    required: false,
  },
  { key: F.stock, id: "product-stock", label: "Stock", step: "1", required: true },
  { key: F.sortOrder, id: "product-sort", label: "Sort order", step: "1", required: false },
] as const;

export const PRODUCT_TOGGLES = [
  { key: F.isPublished, id: "product-published", label: "Published" },
  { key: F.isFeatured, id: "product-featured", label: "Featured" },
] as const;
