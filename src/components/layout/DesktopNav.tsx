import Link from "next/link";

import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { NAV_LABELS } from "@/lib/constants";

export function DesktopNav() {
  return (
    <nav
      aria-label={NAV_LABELS.primary}
      className="border-surface-800 bg-surface-900/40 hidden items-center gap-1 rounded-full border p-1 md:flex"
    >
      {PRIMARY_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-surface-300 hover:bg-surface-800 hover:text-accent rounded-full px-4 py-2 text-xs font-black tracking-[0.14em] uppercase transition-colors duration-[var(--duration-normal)]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
