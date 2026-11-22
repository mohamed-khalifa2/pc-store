import Link from "next/link";
import type { ReactNode } from "react";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";

type AdminPageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <header className="border-surface-800 mb-10 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <Link
          href={ADMIN_ROUTES.overview}
          className="text-accent text-xs font-black tracking-[0.35em] uppercase"
        >
          {"// "}
          {ADMIN_COPY.breadcrumb}
        </Link>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="text-surface-400 max-w-2xl text-sm leading-relaxed">{description}</p>
      </div>
      {action}
    </header>
  );
}
