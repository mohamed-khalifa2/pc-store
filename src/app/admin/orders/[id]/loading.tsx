import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-10">
      <div className="border-surface-800 space-y-4 border-b pb-8">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-80" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="border-surface-800 rounded-card h-72 border p-6 lg:col-span-2" />
        <div className="border-surface-800 rounded-card h-72 border p-6" />
      </div>
    </div>
  );
}
