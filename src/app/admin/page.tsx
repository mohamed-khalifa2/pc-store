import { Suspense } from "react";

import { AdminOverview } from "@/features/admin/components/AdminOverview";
import { AUTH_COPY } from "@/features/auth/lib/copy";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-surface-400 text-sm">{AUTH_COPY.checkingAccess}</p>}>
      <AdminOverview />
    </Suspense>
  );
}
