import type { BundleDefinition } from "@/features/bundles/config/bundles";
import { getBundleDefinitions } from "@/features/bundles/queries/get-bundle-definitions";
import type { Bundle } from "@/features/bundles/types";
import { getProductBySlug } from "@/features/products/queries/get-product-by-slug";

const MIN_BUNDLE_PRODUCTS = 2;

function toBundle(definition: BundleDefinition, products: Bundle["products"]): Bundle | null {
  if (products.length < MIN_BUNDLE_PRODUCTS) return null;

  const originalPriceEgp = products.reduce((sum, product) => sum + product.priceEgp, 0);
  const discount = 1 - definition.discountPercent / 100;
  const priceEgp = Math.round(originalPriceEgp * discount);

  return {
    id: definition.id,
    slug: definition.slug,
    name: definition.name,
    description: definition.description,
    tag: definition.tag,
    discountPercent: definition.discountPercent,
    products,
    originalPriceEgp,
    priceEgp,
    savingsEgp: originalPriceEgp - priceEgp,
    available: products.every((product) => product.stock > 0),
  };
}

export async function getBundles(): Promise<Bundle[]> {
  const definitions = await getBundleDefinitions();

  const bundles = await Promise.all(
    definitions.map(async (definition) => {
      const products = await Promise.all(
        definition.productSlugs.map((slug) => getProductBySlug(slug)),
      );
      return toBundle(
        definition,
        products.filter((product) => product !== null),
      );
    }),
  );

  return bundles.filter((bundle): bundle is Bundle => bundle !== null);
}
