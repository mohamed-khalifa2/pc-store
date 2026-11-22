import type { AdminSpecFormRow } from "@/features/products/components/admin/SpecsEditor";
import {
  ADMIN_PRODUCT_FIELDS as F,
  adminJsonObjectSchema,
} from "@/features/products/schemas/admin-product";
import type { AdminProductDetail } from "@/features/products/types.admin";
import type { Json } from "@/lib/supabase/types";

export type ProductFormValues = Record<string, string>;

function toDateTimeLocal(value: string | null): string {
  return value && value.length >= 16 ? value.slice(0, 16) : "";
}

function specsToRows(specs: Json): AdminSpecFormRow[] {
  const parsed = adminJsonObjectSchema.safeParse(specs);
  if (!parsed.success) return [];

  return Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value:
      value === null || value === undefined
        ? ""
        : typeof value === "object"
          ? (JSON.stringify(value) ?? "")
          : String(value),
  }));
}

export function productFormValues(product?: AdminProductDetail): ProductFormValues {
  return {
    [F.name]: product?.name ?? "",
    [F.slug]: product?.slug ?? "",
    [F.sku]: product?.sku ?? "",
    [F.description]: product?.description ?? "",
    [F.categoryId]: product?.categoryId ?? "",
    [F.priceEgp]: product ? String(product.priceEgp) : "",
    [F.compareAtPrice]:
      product?.compareAtPrice === null || !product ? "" : String(product.compareAtPrice),
    [F.stock]: product ? String(product.stock) : "0",
    [F.sortOrder]: product ? String(product.sortOrder) : "0",
    [F.publishedAt]: toDateTimeLocal(product?.publishedAt ?? null),
  };
}

export function productFormSpecs(product?: AdminProductDetail): AdminSpecFormRow[] {
  return product ? specsToRows(product.specs) : [];
}
