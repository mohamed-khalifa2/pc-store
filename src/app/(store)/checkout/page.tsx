import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/ui/Container";
import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { CheckoutContainer } from "@/features/checkout/components/CheckoutContainer";
import { CheckoutSkeleton } from "@/features/checkout/components/CheckoutSkeleton";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="space-y-10">
        <header className="space-y-4">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
            {CHECKOUT_COPY.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            {CHECKOUT_COPY.title}
          </h1>
          <p className="text-surface-400 max-w-xl text-sm leading-relaxed">
            {CHECKOUT_COPY.description}
          </p>
        </header>
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutContainer />
        </Suspense>
      </Container>
    </section>
  );
}
