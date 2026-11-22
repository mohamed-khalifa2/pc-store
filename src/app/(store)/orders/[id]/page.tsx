import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetail } from "@/features/orders/components/OrderDetail";
import { OrderDetailSkeleton } from "@/features/orders/components/OrderDetailSkeleton";

export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetail orderId={id} />
    </Suspense>
  );
}
