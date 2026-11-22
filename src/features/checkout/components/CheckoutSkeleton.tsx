import { Skeleton } from "@/components/ui/Skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]" aria-hidden="true">
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
