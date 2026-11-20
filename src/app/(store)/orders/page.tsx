import type { Metadata } from "next";
import { Suspense } from "react";

import { AUTH_COPY } from "@/features/auth/lib/copy";
import { MyOrders } from "@/features/orders/components/MyOrders";

export const metadata: Metadata = {
  title: "My orders",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-surface-400 text-sm">{AUTH_COPY.checkingAccess}</p>
        </div>
      }
    >
      <MyOrders />
    </Suspense>
  );
}
