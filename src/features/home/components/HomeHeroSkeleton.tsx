import { Skeleton } from "@/components/ui/Skeleton";

export function HomeHeroSkeleton() {
  return (
    <div
      className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden"
      aria-busy="true"
    >
      <div
        aria-hidden="true"
        className="from-black-950 via-black-900 to-black-950 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80"
      />
      <div
        className="max-w-container-store relative mx-auto grid min-h-0 flex-1 items-center gap-10 px-5 py-12 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12 lg:py-12"
        aria-hidden="true"
      >
        <div className="order-1 lg:order-2">
          <Skeleton className="mx-auto aspect-square w-full max-w-[30rem] rounded-full lg:max-w-[40rem]" />
        </div>
        <div className="order-2 max-w-2xl space-y-6 lg:order-1">
          <Skeleton className="h-16 w-full max-w-lg" />
          <Skeleton className="h-16 w-4/5 max-w-md" />
          <Skeleton className="h-5 w-full max-w-lg" />
          <Skeleton className="h-5 w-2/3 max-w-sm" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-14 w-40 rounded-md" />
            <Skeleton className="h-14 w-36 rounded-md" />
          </div>
        </div>
      </div>
      <div
        className="border-surface-800 max-w-container-store relative mx-auto grid grid-cols-2 border-t px-5 sm:grid-cols-4 sm:px-8 lg:px-12"
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="border-surface-800/60 flex items-center gap-3 border-b py-5 sm:border-b-0"
          >
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
