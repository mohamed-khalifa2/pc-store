import type { RefObject } from "react";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import Link from "next/link";

type AdminTopbarProps = {
  onOpenNav: () => void;
  navOpen: boolean;
  navId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function AdminTopbar({ onOpenNav, navOpen, navId, triggerRef }: AdminTopbarProps) {
  return (
    <header className="border-surface-800 bg-black-950/80 sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-4">
        <button
          ref={triggerRef}
          type="button"
          onClick={onOpenNav}
          aria-label={ADMIN_COPY.openNav}
          aria-expanded={navOpen}
          aria-controls={navId}
          className="border-surface-700 text-surface-300 flex h-9 w-9 items-center justify-center rounded border lg:hidden"
        >
          ☰
        </button>
        <Link
          href={ADMIN_ROUTES.overview}
          className="text-accent text-xs font-black tracking-[0.3em] uppercase"
        >
          {ADMIN_COPY.dashboard}
        </Link>
      </div>
      <LogoutButton />
    </header>
  );
}
