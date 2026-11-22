"use client";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ADMIN_COPY } from "@/features/admin/config/copy";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="space-y-8">
      <ErrorState title="Products unavailable" description={ADMIN_COPY.loadError} />
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
