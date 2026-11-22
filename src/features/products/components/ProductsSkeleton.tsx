import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductsSkeleton() {
  return (
    <div className="py-14 sm:py-20" aria-busy="true">
      <Container className="space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-14 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <Skeleton className="rounded-card h-44 w-full" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="rounded-card h-80" />
          ))}
        </div>
      </Container>
    </div>
  );
}
