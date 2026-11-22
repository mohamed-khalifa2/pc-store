import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-14 w-72" />
      <Skeleton className="rounded-card h-96 w-full" />
      <Skeleton className="rounded-card h-64 w-full" />
      <Skeleton className="rounded-card h-96 w-full" />
    </div>
  );
}
