"use client";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ADMIN_COPY } from "@/features/admin/config/copy";

type ErrorProps = { reset: () => void };

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="space-y-8">
      <ErrorState title={ADMIN_COPY.loadError} description={ADMIN_COPY.invalidId} />
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
