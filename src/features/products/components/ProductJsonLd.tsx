import { buildProductJsonLd } from "@/features/products/lib/json-ld";
import type { ProductDetailData } from "@/features/products/types";

type ProductJsonLdProps = {
  product: ProductDetailData;
};

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildProductJsonLd(product) }}
    />
  );
}
