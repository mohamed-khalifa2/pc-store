"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";

import { CATEGORY_COPY } from "@/features/categories/config/copy";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <Container className="py-20">
      <ErrorState
        title={CATEGORY_COPY.notFoundTitle}
        description={CATEGORY_COPY.loadErrorDescription}
      />
      <div className="mt-8 flex justify-center">
        <Button onClick={reset}>{CATEGORY_COPY.tryAgain}</Button>
      </div>
    </Container>
  );
}
