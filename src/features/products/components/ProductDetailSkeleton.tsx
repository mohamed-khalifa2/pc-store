import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

import { RelatedProductsSkeleton } from "@/features/products/components/RelatedProductsSkeleton";

export function ProductDetailSkeleton() {
  return (
    <>
      <Section spacing="tight" aria-busy="true">
        <Container className="space-y-10">
          <Skeleton className="h-4 w-64" aria-hidden="true" />
          <div className="grid gap-10 lg:grid-cols-2" aria-hidden="true">
            <div className="space-y-4">
              <Skeleton className="rounded-card aspect-square w-full" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="size-20 rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="rounded-card h-48 w-full" />
            </div>
          </div>
        </Container>
      </Section>
      <RelatedProductsSkeleton />
    </>
  );
}
