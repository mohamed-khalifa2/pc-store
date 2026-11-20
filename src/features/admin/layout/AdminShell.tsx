import Link from "next/link";
import type { ReactNode } from "react";

import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/lib/constants";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black-950 flex min-h-screen flex-col">
      <header className="border-surface-800 border-b">
        <Container className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href={ROUTES.admin} className="text-accent text-lg font-black tracking-tight">
              ADMIN<span className="text-white">{"//PC"}</span>
            </Link>
            <span className="border-accent-strong text-surface-400 rounded border px-2 py-1 text-[10px] font-bold tracking-widest uppercase">
              Dashboard
            </span>
          </div>
          <LogoutButton />
        </Container>
      </header>
      <main className="flex-1 py-12">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
