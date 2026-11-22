import { Skeleton } from "@/components/ui/Skeleton";

export function OrderDetailSkeleton() {
  return (
    <section className="py-16 sm:py-24" aria-hidden="true">
      <div className="max-w-container-store mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    </section>
  );
}
