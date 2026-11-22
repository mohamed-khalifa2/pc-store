import { Skeleton } from "@/components/ui/Skeleton";

const ROW_PLACEHOLDERS = [0, 1, 2, 3] as const;

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="border-surface-800 space-y-4 border-b pb-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="border-surface-800 rounded-card space-y-4 border p-6">
        {ROW_PLACEHOLDERS.map((index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
