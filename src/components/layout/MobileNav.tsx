"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { PRIMARY_NAV_ITEMS } from "@/components/layout/nav-items";
import { buttonClassName } from "@/components/ui/button-styles";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { MenuIcon } from "@/components/ui/icons/MenuIcon";
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
        className={buttonClassName("secondary", "sm", "size-10 px-0")}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        id={panelId}
        aria-label={NAV_LABELS.mobile}
        hidden={!isOpen}
        className="border-surface-800 bg-black-950/95 absolute inset-x-0 top-20 border-b px-5 py-6 shadow-2xl shadow-black backdrop-blur-xl sm:px-8"
      >
        <ul className="flex flex-col">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <li key={item.href} className="border-surface-800 border-b last:border-b-0">
              <Link
                href={item.href}
                className="hover:text-accent block py-3 text-base font-black tracking-[0.12em] text-white uppercase transition-colors"
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
