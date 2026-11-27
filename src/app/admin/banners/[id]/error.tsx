"use client";

import { AdminRouteError } from "@/features/admin/components/AdminRouteError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return <AdminRouteError reset={reset} />;
}
