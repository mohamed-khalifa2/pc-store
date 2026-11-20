import Link from "next/link";

import { FOOTER_NAV_ITEMS } from "@/components/layout/nav-items";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { NAV_LABELS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-surface-800 bg-black-950 border-t py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="text-surface-400 text-sm">© {SITE_NAME}. All rights reserved.</p>
        </div>

        <nav aria-label={NAV_LABELS.footer} className="flex flex-wrap gap-x-6 gap-y-3">
          {FOOTER_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-surface-300 hover:text-accent text-sm font-bold tracking-[0.12em] uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
