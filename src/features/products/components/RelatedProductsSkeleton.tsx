import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function RelatedProductsSkeleton() {
  return (
    <div className="border-surface-800 border-t py-14 sm:py-20" aria-busy="true">
      <Container className="space-y-10">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="rounded-card h-80" />
          ))}
        </div>
      </Container>
    </div>
  );
}
