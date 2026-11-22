import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="py-14 sm:py-20" aria-busy="true">
      <Container className="space-y-10">
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="rounded-card aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-48 rounded-md" />
            <Skeleton className="rounded-card h-56 w-full" />
          </div>
        </div>
      </Container>
    </div>
  );
}
