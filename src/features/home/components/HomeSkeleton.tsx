import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";

import { BundleCardSkeleton } from "@/features/bundles/components/BundleCardSkeleton";
import { DEFAULT_SECTION_LIMITS } from "@/features/home/config/sections";
import { HomeHeroSkeleton } from "@/features/home/components/HomeHeroSkeleton";
import { SectionHeadingSkeleton } from "@/features/home/components/SectionHeadingSkeleton";
import { ProductCardSkeleton } from "@/features/products/components/ProductCardSkeleton";

const BUNDLE_SKELETON_COUNT = 3;

export function HomeSkeleton() {
  return (
    <div aria-busy="true">
      <HomeHeroSkeleton />

      <div className="border-surface-800 bg-black-900 border-y py-10" aria-hidden="true">
        <div className="flex flex-wrap justify-center gap-8">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-6 w-20" />
          ))}
        </div>
      </div>

      <Section>
        <Container className="space-y-10">
          <SectionHeadingSkeleton />
          <Skeleton className="rounded-card h-72 w-full" />
        </Container>
      </Section>

      <Section className="border-surface-800 border-b">
        <Container className="space-y-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: DEFAULT_SECTION_LIMITS.categories }, (_, index) => (
              <Skeleton key={index} className="rounded-card aspect-[4/3] w-full" />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-surface-800 border-b">
        <Container className="space-y-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: DEFAULT_SECTION_LIMITS.products }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-surface-800 border-b">
        <Container className="space-y-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: BUNDLE_SKELETON_COUNT }, (_, index) => (
              <BundleCardSkeleton key={index} />
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container aria-hidden="true">
          <Skeleton className="rounded-card h-40 w-full" />
        </Container>
      </Section>

      <Section className="border-surface-800 border-b">
        <Container className="space-y-10">
          <SectionHeadingSkeleton />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="rounded-card h-40 w-full" />
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-surface-800 border-b">
        <Container aria-hidden="true">
          <Skeleton className="rounded-card h-56 w-full" />
        </Container>
      </Section>

      <Section className="border-surface-800 border-t">
        <Container className="space-y-6 text-center" aria-hidden="true">
          <Skeleton className="mx-auto h-3 w-32" />
          <Skeleton className="mx-auto h-14 w-96 max-w-full" />
          <Skeleton className="mx-auto h-14 w-44 rounded-md" />
        </Container>
      </Section>
    </div>
  );
}
