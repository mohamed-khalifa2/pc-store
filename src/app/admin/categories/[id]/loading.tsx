import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="border-surface-800 space-y-4 border-b pb-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-72" />
      </div>
      <div className="border-surface-800 rounded-card grid gap-6 border p-6 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}
