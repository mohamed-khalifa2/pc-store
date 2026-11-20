import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { AdminShell } from "@/features/admin/layout/AdminShell";
import { AdminGuard } from "@/features/auth/components/AdminGuard";
import { AUTH_COPY } from "@/features/auth/lib/copy";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="bg-black-950 flex min-h-screen items-center justify-center">
          <p className="text-surface-400 text-sm">{AUTH_COPY.checkingAccess}</p>
        </div>
      }
    >
      <AdminGuard>
        <AdminShell>{children}</AdminShell>
      </AdminGuard>
    </Suspense>
  );
}
