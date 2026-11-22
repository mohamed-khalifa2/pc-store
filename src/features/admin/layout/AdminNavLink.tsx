"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

type AdminNavLinkProps = {
  href: string;
  label: string;
  short: string;
  onNavigate?: () => void;
};

export function AdminNavLink({ href, label, short, onNavigate }: AdminNavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "border-l-2 px-4 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-colors",
        active
          ? "border-accent bg-accent/10 text-accent"
          : "text-surface-400 hover:border-surface-700 border-transparent hover:text-white",
      )}
    >
      <span className="lg:hidden">{short}</span>
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}
