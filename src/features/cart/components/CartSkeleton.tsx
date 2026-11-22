import { Skeleton } from "@/components/ui/Skeleton";
import { CART_COPY } from "@/features/cart/config/cart-config";

const SKELETON_ROWS = 3;

export function CartSkeleton() {
  return (
    <div role="status" className="space-y-5" aria-label={CART_COPY.loading}>
      <span className="sr-only">{CART_COPY.loading}</span>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div
          key={index}
          className="border-surface-800 bg-surface-900/50 rounded-card flex gap-4 border p-4"
        >
          <Skeleton className="size-20 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      ))}
      <Skeleton className="h-14 w-full" />
    </div>
  );
}
