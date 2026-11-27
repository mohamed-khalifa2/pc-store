import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";

export function ProductsSkeleton() {
  return (
    <Section spacing="tight" aria-busy="true">
      <Container className="space-y-8">
        <div
          className="border-surface-800 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
          aria-hidden="true"
        >
          <div className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-12 w-72 max-w-full" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
          <Skeleton className="h-9 w-28 self-start rounded-full sm:self-end" />
        </div>

        <div
          className="border-surface-800 bg-surface-900/50 rounded-card border p-5 sm:p-6"
          aria-hidden="true"
        >
          <Skeleton className="mb-6 h-9 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
          <div className="border-surface-800 mt-5 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-28" />
              <Skeleton className="h-11 w-20" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
