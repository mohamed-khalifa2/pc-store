import { ROUTES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import type { ProductDetailData } from "@/features/products/types";

const SCHEMA_CONTEXT = "https://schema.org";
const SCHEMA_PRODUCT = `${SCHEMA_CONTEXT}/Product`;
const SCHEMA_OFFER = `${SCHEMA_CONTEXT}/Offer`;
const IN_STOCK = `${SCHEMA_CONTEXT}/InStock`;
const OUT_OF_STOCK = `${SCHEMA_CONTEXT}/OutOfStock`;
const CURRENCY = "EGP";

export function buildProductJsonLd(product: ProductDetailData): string {
  const schema = {
    "@context": SCHEMA_CONTEXT,
    "@type": SCHEMA_PRODUCT,
    name: product.name,
    description: product.description ?? PRODUCT_COPY.catalogDescription,
    sku: product.sku,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": SCHEMA_OFFER,
      price: product.priceEgp,
      priceCurrency: CURRENCY,
      availability: product.stock > 0 ? IN_STOCK : OUT_OF_STOCK,
      url: new URL(ROUTES.product(product.slug), getSiteUrl()).toString(),
    },
  };

  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
