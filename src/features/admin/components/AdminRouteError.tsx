"use client";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ADMIN_COPY } from "@/features/admin/config/copy";

const TRY_AGAIN = "Try again";

type AdminRouteErrorProps = {
  reset: () => void;
  title?: string;
};

export function AdminRouteError({ reset, title = ADMIN_COPY.loadError }: AdminRouteErrorProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <ErrorState title={title} description={ADMIN_COPY.unexpectedError} />
      <Button onClick={reset}>{TRY_AGAIN}</Button>
    </div>
  );
}
