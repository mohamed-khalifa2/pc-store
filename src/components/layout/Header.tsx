import { CartIndicator } from "@/components/layout/CartIndicator";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/layout/MobileNav";
import { Container } from "@/components/ui/Container";

export function Header() {
  return (
    <header className="border-surface-800 bg-black-950/90 sticky top-0 z-50 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />
        <div className="flex items-center gap-5 sm:gap-8">
          <DesktopNav />
          <CartIndicator />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
