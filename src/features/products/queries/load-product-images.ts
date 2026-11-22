import { z } from "zod";

import { STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";
import type { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_PRODUCT_IMAGE } from "@/features/products/config/defaults";
import { productImageRowSchema } from "@/features/products/schemas/product";
import type { ProductImageData } from "@/features/products/types";

type PublicClient = ReturnType<typeof createPublicClient>;

export type ProductImageMap = Record<string, ProductImageData[]>;

const DEFAULT_IMAGE_ALT = "Product image";

export async function loadProductImages(
  client: PublicClient,
  productIds: string[],
  fallbackAlt: string = DEFAULT_IMAGE_ALT,
): Promise<ProductImageMap> {
  if (productIds.length === 0) return {};

  try {
    const { data, error } = await client
      .from("product_images")
      .select("product_id, storage_path, alt_text, sort_order")
      .in("product_id", productIds)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return {};

    const parsed = z.array(productImageRowSchema).safeParse(data ?? []);
    if (!parsed.success) return {};

    const map: ProductImageMap = {};
    for (const row of parsed.data) {
      const image: ProductImageData = {
        url: resolveAssetUrl(
          row.storage_path,
          STORAGE_BUCKETS.productImages,
          DEFAULT_PRODUCT_IMAGE,
        ),
        alt: row.alt_text ?? fallbackAlt,
      };
      (map[row.product_id] ??= []).push(image);
    }

    return map;
  } catch {
    return {};
  }
}

export function firstImageUrl(map: ProductImageMap, productId: string): string {
  return map[productId]?.[0]?.url ?? DEFAULT_PRODUCT_IMAGE;
}
