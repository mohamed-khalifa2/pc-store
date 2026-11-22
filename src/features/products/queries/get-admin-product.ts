import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  adminProductImageRowSchema,
  adminProductRowSchema,
} from "@/features/products/schemas/admin-product";
import type { AdminProductDetail } from "@/features/products/types.admin";

export async function getAdminProduct(rawId: string): Promise<AdminProductDetail | null> {
  await requireAdmin();

  const id = z.uuid().safeParse(rawId);
  if (!id.success) return null;

  const client = createAdminClient();

  try {
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("id", id.data)
      .maybeSingle();
    if (error || !data) return null;

    const row = adminProductRowSchema.safeParse(data);
    if (!row.success) return null;

    const { data: imageData, error: imageError } = await client
      .from("product_images")
      .select("*")
      .eq("product_id", id.data)
      .order("sort_order", { ascending: true });
    if (imageError) return null;

    const images = z.array(adminProductImageRowSchema).safeParse(imageData ?? []);
    if (!images.success) return null;

    return {
      id: row.data.id,
      name: row.data.name,
      slug: row.data.slug,
      sku: row.data.sku,
      description: row.data.description,
      priceEgp: row.data.price_egp,
      compareAtPrice: row.data.compare_at_price,
      stock: row.data.stock,
      categoryId: row.data.category_id,
      specs: row.data.specs,
      isFeatured: row.data.is_featured,
      isPublished: row.data.is_published,
      sortOrder: row.data.sort_order,
      publishedAt: row.data.published_at,
      images: images.data.map((image) => ({
        id: image.id,
        storagePath: image.storage_path,
        altText: image.alt_text,
        sortOrder: image.sort_order,
        isActive: image.is_active,
      })),
    };
  } catch {
    return null;
  }
}
