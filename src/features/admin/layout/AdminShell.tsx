"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { AdminSidebar } from "@/features/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/features/admin/layout/AdminTopbar";

const MOBILE_NAV_ID = "admin-mobile-nav";

export function AdminShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!navOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavOpen(false);
    };

    const trigger = triggerRef.current;
    document.addEventListener("keydown", onKeyDown);
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [navOpen]);

  return (
    <div className="bg-black-950 flex min-h-screen text-white">
      <AdminSidebar className="border-surface-800 bg-black-900 fixed inset-y-0 left-0 z-50 hidden w-60 overflow-x-hidden overflow-y-auto border-r lg:block" />
      {navOpen ? (
        <div
          id={MOBILE_NAV_ID}
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={ADMIN_COPY.adminNav}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label={ADMIN_COPY.closeNav}
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-black/80"
          />
          <AdminSidebar
            className="border-surface-800 bg-black-900 absolute inset-y-0 left-0 w-64 max-w-[85vw] overflow-x-hidden overflow-y-auto border-r"
            onNavigate={() => setNavOpen(false)}
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1 lg:pl-60">
        <AdminTopbar
          onOpenNav={() => setNavOpen(true)}
          navOpen={navOpen}
          navId={MOBILE_NAV_ID}
          triggerRef={triggerRef}
        />
        <main className="py-10">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}
