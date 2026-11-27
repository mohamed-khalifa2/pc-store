import { Skeleton } from "@/components/ui/Skeleton";

export function SectionHeadingSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-12 w-80 max-w-full" />
      <Skeleton className="h-5 w-full max-w-xl" />
    </div>
  );
}
