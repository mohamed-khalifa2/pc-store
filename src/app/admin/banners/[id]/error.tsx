"use client";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ADMIN_COPY } from "@/features/admin/config/copy";

const TRY_AGAIN = "Try again";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="space-y-8 py-10">
      <ErrorState title={ADMIN_COPY.loadError} description={ADMIN_COPY.unexpectedError} />
      <div className="flex justify-center">
        <Button onClick={reset}>{TRY_AGAIN}</Button>
      </div>
    </div>
  );
}
