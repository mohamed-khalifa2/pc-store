import { Skeleton } from "@/components/ui/Skeleton";

const STAT_PLACEHOLDERS = [0, 1, 2, 3] as const;

type AdminRouteSkeletonProps = {
  variant?: "overview" | "list" | "form";
};

export function AdminRouteSkeleton({ variant = "list" }: AdminRouteSkeletonProps) {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="border-surface-800 space-y-4 border-b pb-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      {variant === "overview" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_PLACEHOLDERS.map((index) => (
            <Skeleton key={index} className="rounded-card h-32" />
          ))}
        </div>
      ) : null}
      <Skeleton className="rounded-card h-24 w-full" />
      <Skeleton className="rounded-card h-80 w-full" />
      {variant === "form" ? <Skeleton className="rounded-card h-40 w-full" /> : null}
    </div>
  );
}
