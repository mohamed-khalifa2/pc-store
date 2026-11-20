import Link from "next/link";

import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { NAV_LABELS } from "@/lib/constants";

export function DesktopNav() {
  return (
    <nav aria-label={NAV_LABELS.primary} className="hidden items-center gap-8 md:flex">
      {PRIMARY_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-surface-200 hover:text-accent text-sm font-bold tracking-[0.12em] uppercase transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
