"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";

import { PRODUCT_COPY } from "@/features/products/config/copy";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <Container className="py-20">
      <ErrorState
        title={PRODUCT_COPY.productNotFound}
        description={PRODUCT_COPY.loadErrorDescription}
      />
      <div className="mt-8 flex justify-center">
        <Button onClick={reset}>{PRODUCT_COPY.tryAgain}</Button>
      </div>
    </Container>
  );
}
