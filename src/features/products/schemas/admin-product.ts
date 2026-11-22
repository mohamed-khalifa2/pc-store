import { z } from "zod";

import type { Json } from "@/lib/supabase/types";

export const ADMIN_PRODUCT_FIELDS = {
  id: "id",
  name: "name",
  slug: "slug",
  sku: "sku",
  description: "description",
  categoryId: "categoryId",
  priceEgp: "priceEgp",
  compareAtPrice: "compareAtPrice",
  stock: "stock",
  sortOrder: "sortOrder",
  isPublished: "isPublished",
  isFeatured: "isFeatured",
  publishedAt: "publishedAt",
  specKey: "specKey",
  specValue: "specValue",
  imagePaths: "imagePaths",
  category: "category",
  published: "published",
  q: "q",
  page: "page",
} as const;

export const ADMIN_PUBLISHED_FILTER = { all: "all", true: "true", false: "false" } as const;
export const ADMIN_SPECS_MAX = 30;
export const ADMIN_IMAGES_MAX = 10;

export const adminProductFiltersSchema = z.object({
  q: z.string().trim().max(200).default(""),
  category: z.string().trim().max(200).default(""),
  published: z
    .enum([ADMIN_PUBLISHED_FILTER.all, ADMIN_PUBLISHED_FILTER.true, ADMIN_PUBLISHED_FILTER.false])
    .default(ADMIN_PUBLISHED_FILTER.all),
  page: z.coerce.number().int().min(1).max(100000).default(1),
});

export type AdminProductFilters = z.infer<typeof adminProductFiltersSchema>;

export const adminCategoryOptionRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
});

export type AdminCategoryOption = z.infer<typeof adminCategoryOptionRowSchema>;

export const adminJsonObjectSchema = z.custom<Record<string, Json>>(
  (value) => typeof value === "object" && value !== null && !Array.isArray(value),
);

export const adminProductRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().nullable(),
  price_egp: z.number().finite().nonnegative(),
  compare_at_price: z.number().finite().nonnegative().nullable(),
  stock: z.number().int().nonnegative(),
  category_id: z.string().nullable(),
  specs: adminJsonObjectSchema,
  is_featured: z.boolean(),
  is_published: z.boolean(),
  sort_order: z.number().int(),
  published_at: z.string().nullable(),
});

export const adminProductImageRowSchema = z.object({
  id: z.string().min(1),
  product_id: z.string().min(1),
  storage_path: z.string().min(1),
  alt_text: z.string().nullable(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
});
