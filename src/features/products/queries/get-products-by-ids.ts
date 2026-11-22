import { z } from "zod";

import { createPublicClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

import { DEFAULT_PRODUCT_DETAILS } from "@/features/products/config/detail-defaults";
import { checkoutCatalogRowSchema } from "@/features/products/schemas/checkout";
import type { CheckoutProductData } from "@/features/products/types";

const PRODUCT_COLUMNS =
  "id, name, slug, description, price_egp, compare_at_price, stock, sku, specs, sort_order";

const idsSchema = z.array(z.string().min(1).max(200)).max(100).catch([]);

export async function getProductsByIds(ids: string[]): Promise<CheckoutProductData[]> {
  const productIds = idsSchema.parse(ids);
  if (productIds.length === 0) return [];

  try {
    const client = createPublicClient();
    const { data, error } = await client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .in("id", productIds)
      .order("sort_order", { ascending: true });

    if (error) return defaultCheckoutProducts(productIds);

    const parsed = z.array(checkoutCatalogRowSchema).safeParse(data ?? []);
    if (!parsed.success) return [];

    return parsed.data.map((row) => ({
      id: row.id,
      name: row.name,
      sku: row.sku,
      priceEgp: row.price_egp,
      stock: row.stock,
      specs: row.specs,
    }));
  } catch {
    return defaultCheckoutProducts(productIds);
  }
}

function defaultCheckoutProducts(ids: string[]): CheckoutProductData[] {
  return DEFAULT_PRODUCT_DETAILS.filter((product) => ids.includes(product.id)).map((product) => {
    const specs: Json = Object.fromEntries(
      product.specs.map((spec) => [spec.label.toLowerCase().replaceAll(" ", "_"), spec.value]),
    );

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      priceEgp: product.priceEgp,
      stock: product.stock,
      specs,
    };
  });
}
