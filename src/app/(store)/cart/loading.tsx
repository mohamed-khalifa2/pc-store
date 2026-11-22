import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";

export default function Loading() {
  return (
    <Container className="py-16">
      <Skeleton className="h-20 w-64" />
      <div className="mt-12">
        <CartSkeleton />
      </div>
    </Container>
  );
}
