"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formBoolean, formNumber, formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { removeImages } from "@/features/admin/lib/storage";
import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";
import {
  ADMIN_IMAGES_MAX,
  ADMIN_PRODUCT_FIELDS,
  ADMIN_SPECS_MAX,
  adminProductImageRowSchema,
} from "@/features/products/schemas/admin-product";
import {
  adminProductFormSchema,
  adminSpecsInputSchema,
} from "@/features/products/schemas/admin-product-form";

type UpsertResult = AdminActionResult<{ id: string }>;

const UNIQUE_VIOLATION = "23505";

function indexedValues(formData: FormData, prefix: string, max: number): string[] {
  const values: string[] = [];
  for (let index = 0; index < max; index += 1) {
    const value = formData.get(`${prefix}${index}`);
    if (typeof value !== "string") break;
    values.push(value.trim());
  }
  return values;
}

function submittedPaths(formData: FormData): string[] {
  return formData
    .getAll(ADMIN_PRODUCT_FIELDS.imagePaths)
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
}

function writeFailure(code: string | undefined, fallback: string): UpsertResult {
  return adminFailure<{ id: string }>(
    code === UNIQUE_VIOLATION ? "A product with this slug or SKU already exists." : fallback,
  );
}

export async function upsertProduct(
  _previous: UpsertResult,
  formData: FormData,
): Promise<UpsertResult> {
  await requireAdmin();

  const specs = adminSpecsInputSchema.safeParse({
    keys: indexedValues(formData, ADMIN_PRODUCT_FIELDS.specKey, ADMIN_SPECS_MAX),
    values: indexedValues(formData, ADMIN_PRODUCT_FIELDS.specValue, ADMIN_SPECS_MAX),
  });
  if (!specs.success) {
    return adminFailure<{ id: string }>("Check the highlighted specifications.", {
      specs: specs.error.issues.map((issue) => issue.message),
    });
  }

  const parsed = adminProductFormSchema.safeParse({
    [ADMIN_PRODUCT_FIELDS.id]: formString(formData, ADMIN_PRODUCT_FIELDS.id),
    [ADMIN_PRODUCT_FIELDS.name]: formString(formData, ADMIN_PRODUCT_FIELDS.name),
    [ADMIN_PRODUCT_FIELDS.slug]: formString(formData, ADMIN_PRODUCT_FIELDS.slug),
    [ADMIN_PRODUCT_FIELDS.sku]: formString(formData, ADMIN_PRODUCT_FIELDS.sku),
    [ADMIN_PRODUCT_FIELDS.description]: formString(formData, ADMIN_PRODUCT_FIELDS.description),
    [ADMIN_PRODUCT_FIELDS.categoryId]: formString(formData, ADMIN_PRODUCT_FIELDS.categoryId),
    [ADMIN_PRODUCT_FIELDS.priceEgp]: formNumber(formData, ADMIN_PRODUCT_FIELDS.priceEgp),
    [ADMIN_PRODUCT_FIELDS.compareAtPrice]: formNumber(
      formData,
      ADMIN_PRODUCT_FIELDS.compareAtPrice,
    ),
    [ADMIN_PRODUCT_FIELDS.stock]: formNumber(formData, ADMIN_PRODUCT_FIELDS.stock),
    [ADMIN_PRODUCT_FIELDS.sortOrder]: formNumber(formData, ADMIN_PRODUCT_FIELDS.sortOrder) ?? 0,
    [ADMIN_PRODUCT_FIELDS.isPublished]: formBoolean(formData, ADMIN_PRODUCT_FIELDS.isPublished),
    [ADMIN_PRODUCT_FIELDS.isFeatured]: formBoolean(formData, ADMIN_PRODUCT_FIELDS.isFeatured),
    [ADMIN_PRODUCT_FIELDS.publishedAt]: formString(formData, ADMIN_PRODUCT_FIELDS.publishedAt),
    specs: specs.data,
    imagePaths: submittedPaths(formData),
  });
  if (!parsed.success) return adminValidation<{ id: string }>(parsed.error);

  const values = parsed.data;
  const isEdit = values.id.length > 0;
  const client = createAdminClient();
  const payload: Database["public"]["Tables"]["products"]["Insert"] = {
    name: values.name,
    slug: values.slug,
    sku: values.sku,
    description: values.description || null,
    category_id: values.categoryId || null,
    price_egp: values.priceEgp,
    compare_at_price: values.compareAtPrice,
    stock: values.stock,
    sort_order: values.sortOrder,
    specs: values.specs,
    is_featured: values.isFeatured,
    is_published: values.isPublished,
    published_at: values.publishedAt,
  };

  let productId = values.id;
  if (isEdit) {
    const { error } = await client.from("products").update(payload).eq("id", values.id);
    if (error) return writeFailure(error.code, "The product could not be updated.");
  } else {
    const { data, error } = await client.from("products").insert(payload).select("id").single();
    if (error || !data) {
      return writeFailure(error?.code, "The product could not be created.");
    }
    productId = data.id;
  }

  const { data: existingData, error: existingError } = await client
    .from("product_images")
    .select("*")
    .eq("product_id", productId);
  if (existingError) {
    return adminFailure<{ id: string }>("The product images could not be saved.");
  }
  const existingRows = z.array(adminProductImageRowSchema).safeParse(existingData ?? []);
  if (!existingRows.success) {
    return adminFailure<{ id: string }>("The product images could not be saved.");
  }

  const submitted = [...new Set(values.imagePaths)].slice(0, ADMIN_IMAGES_MAX);
  const previousPaths = new Set(existingRows.data.map((image) => image.storage_path));
  const removedPaths = [...previousPaths].filter((path) => !submitted.includes(path));

  const { error: deleteError } = await client
    .from("product_images")
    .delete()
    .eq("product_id", productId);
  if (deleteError) {
    return adminFailure<{ id: string }>("The product images could not be saved.");
  }

  if (submitted.length > 0) {
    const rows = submitted.map((path, index) => ({
      product_id: productId,
      storage_path: path,
      sort_order: index,
      is_active: true,
      alt_text: null,
    }));
    const { error: insertError } = await client.from("product_images").insert(rows);
    if (insertError) {
      return adminFailure<{ id: string }>("The product images could not be saved.");
    }
  }

  await removeImages(client, STORAGE_BUCKETS.productImages, removedPaths).catch(() => undefined);
  revalidatePublic([CACHE_TAGS.products]);

  return adminSuccess(isEdit ? "Product updated." : "Product created.", { id: productId });
}
