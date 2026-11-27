import { Skeleton } from "@/components/ui/Skeleton";

export function BundleCardSkeleton() {
  return (
    <div
      className="rounded-card border-surface-800 bg-surface-900/60 border p-4"
      aria-hidden="true"
    >
      <Skeleton className="aspect-[16/10] w-full rounded-xl" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="border-surface-800 flex items-end justify-between border-t pt-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
