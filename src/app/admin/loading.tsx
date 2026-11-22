import { Skeleton } from "@/components/ui/Skeleton";

const STAT_PLACEHOLDERS = [0, 1, 2, 3] as const;

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="border-surface-800 space-y-4 border-b pb-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_PLACEHOLDERS.map((index) => (
          <Skeleton key={index} className="rounded-card h-32" />
        ))}
      </div>
      <Skeleton className="rounded-card h-80" />
    </div>
  );
}
