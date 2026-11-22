import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { ROUTES } from "@/lib/constants";
import { formatEgp } from "@/lib/format/currency";

import { AddToCartButton } from "@/features/products/components/AddToCartButton";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { ProductJsonLd } from "@/features/products/components/ProductJsonLd";
import { ProductSpecsTable } from "@/features/products/components/ProductSpecsTable";
import { ProductStock } from "@/features/products/components/ProductStock";
import { RelatedProducts } from "@/features/products/components/RelatedProducts";
import { RelatedProductsSkeleton } from "@/features/products/components/RelatedProductsSkeleton";
import { PRODUCT_COPY } from "@/features/products/config/copy";
import { getProductBySlug } from "@/features/products/queries/get-product-by-slug";

type ProductDetailProps = {
  slug: string;
};

export async function ProductDetail({ slug }: ProductDetailProps) {
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <Section spacing="tight">
        <Container>
          <EmptyState
            title={PRODUCT_COPY.productNotFound}
            description={PRODUCT_COPY.productNotFoundDescription}
            action={<LinkButton href={ROUTES.products}>{PRODUCT_COPY.browseProducts}</LinkButton>}
          />
        </Container>
      </Section>
    );
  }

  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.priceEgp;

  return (
    <>
      <ProductJsonLd product={product} />
      <Section spacing="tight">
        <Container className="space-y-10">
          <nav
            aria-label="Breadcrumb"
            className="text-surface-500 flex flex-wrap gap-2 text-xs font-black tracking-[0.12em] uppercase"
          >
            <Link href={ROUTES.products} className="hover:text-accent">
              {PRODUCT_COPY.catalogTitle}
            </Link>
            {product.category && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={ROUTES.category(product.category.slug)} className="hover:text-accent">
                  {product.category.name}
                </Link>
              </>
            )}
            <span aria-hidden="true">/</span>
            <span className="text-surface-200">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery images={product.images} name={product.name} />
            <div className="space-y-6">
              <Heading level={1} size="section">
                {product.name}
              </Heading>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-accent text-3xl font-black">
                  {formatEgp(product.priceEgp)}
                </span>
                {onSale && product.compareAtPrice !== null && (
                  <s className="text-surface-400">{formatEgp(product.compareAtPrice)}</s>
                )}
              </div>
              {product.description && (
                <p className="text-surface-400 leading-relaxed">{product.description}</p>
              )}
              <ProductStock stock={product.stock} />
              <AddToCartButton productId={product.id} stock={product.stock} />
              <ProductSpecsTable specs={product.specs} />
            </div>
          </div>
        </Container>
      </Section>

      <Suspense fallback={<RelatedProductsSkeleton />}>
        <RelatedProducts categorySlug={product.category?.slug ?? null} excludeId={product.id} />
      </Suspense>
    </>
  );
}
