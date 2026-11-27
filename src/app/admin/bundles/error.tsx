"use client";

import { AdminRouteError } from "@/features/admin/components/AdminRouteError";

const TITLE = "Bundles could not be loaded.";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return <AdminRouteError reset={reset} title={TITLE} />;
}
