"use client";

import { buttonClassName } from "@/components/ui/button-styles";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center gap-8 text-center">
      <p className="text-accent font-mono text-sm font-bold tracking-[0.3em] uppercase">
        System fault
      </p>
      <Heading level={1}>Something broke</Heading>
      <p className="text-surface-400 max-w-md">
        The store hit an unexpected error. Try again, and we will get you back to the build.
      </p>
      {error.digest ? (
        <p className="text-surface-500 font-mono text-xs">Ref: {error.digest}</p>
      ) : null}
      <button type="button" className={buttonClassName("primary", "lg")} onClick={reset}>
        Try again
      </button>
    </Container>
  );
}
