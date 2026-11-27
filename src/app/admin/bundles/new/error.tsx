"use client";

import { AdminRouteError } from "@/features/admin/components/AdminRouteError";

const TITLE = "Bundle could not be created.";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return <AdminRouteError reset={reset} title={TITLE} />;
}
