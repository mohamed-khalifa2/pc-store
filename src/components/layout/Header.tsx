import { CartIndicator } from "@/components/layout/CartIndicator";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="border-surface-800/80 bg-black-950/85 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="from-accent via-accent-strong/60 pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent" />
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo />
        <div className="flex items-center gap-4 sm:gap-8">
          <DesktopNav />
          <CartIndicator />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
