import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function CategoriesSkeleton() {
  return (
    <div className="py-14 sm:py-20" aria-busy="true">
      <Container className="space-y-10">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-14 w-64 max-w-full" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="rounded-card aspect-[4/3]" />
          ))}
        </div>
      </Container>
    </div>
  );
}
