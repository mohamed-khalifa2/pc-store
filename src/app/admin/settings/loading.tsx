import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-14 w-72" />
      <Skeleton className="rounded-card h-[40rem] w-full" />
    </div>
  );
}
