"use client";

import { useState, type ReactNode } from "react";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { AdminSidebar } from "@/features/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/features/admin/layout/AdminTopbar";
import { Container } from "@/components/ui/Container";

export function AdminShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="bg-black-950 flex min-h-screen text-white">
      <AdminSidebar className="border-surface-800 bg-black-900 fixed inset-y-0 left-0 z-50 hidden w-60 border-r lg:block" />
      {navOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={ADMIN_COPY.closeNav}
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-black/80"
          />
          <AdminSidebar
            className="border-surface-800 bg-black-900 absolute inset-y-0 left-0 w-64 border-r"
            onNavigate={() => setNavOpen(false)}
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1 lg:pl-60">
        <AdminTopbar onOpenNav={() => setNavOpen(true)} />
        <main className="py-10">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}
