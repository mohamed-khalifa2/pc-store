import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

import { BundleCardSkeleton } from "@/features/bundles/components/BundleCardSkeleton";

export function BundlesSkeleton() {
  return (
    <Section className="border-surface-800 border-b" aria-busy="true">
      <Container className="space-y-10" aria-hidden="true">
        <div className="space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-80 max-w-full" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <BundleCardSkeleton key={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
