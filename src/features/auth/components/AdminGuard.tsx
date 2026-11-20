import type { ReactNode } from "react";

import { requireAdmin } from "@/features/auth/lib/require-admin";

export async function AdminGuard({ children }: { children: ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
