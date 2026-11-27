import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";

export function RelatedProductsSkeleton() {
  return (
    <Section spacing="tight" className="border-surface-800 border-t" aria-busy="true">
      <Container className="space-y-10" aria-hidden="true">
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
