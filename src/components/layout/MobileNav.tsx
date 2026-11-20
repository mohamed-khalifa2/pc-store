"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { buttonClassName } from "@/components/ui/button-styles";
import { NAV_LABELS } from "@/lib/constants";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? NAV_LABELS.menuClose : NAV_LABELS.menuOpen}
        className={buttonClassName("ghost", "sm")}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? NAV_LABELS.menuClose : NAV_LABELS.menuOpen}
      </button>

      <nav
        id={panelId}
        aria-label={NAV_LABELS.mobile}
        hidden={!isOpen}
        className="border-surface-800 bg-black-950 absolute inset-x-0 top-16 border-b px-5 py-6 sm:px-8"
      >
        <ul className="flex flex-col gap-4">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-accent block text-lg font-black tracking-[0.12em] text-white uppercase"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
