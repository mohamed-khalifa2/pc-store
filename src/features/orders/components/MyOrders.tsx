import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { AUTH_COPY } from "@/features/auth/lib/copy";
import { requireUser } from "@/features/auth/lib/require-user";

export async function MyOrders() {
  const claims = await requireUser();

  return (
    <section className="py-16 sm:py-24">
      <Container className="space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
              {AUTH_COPY.ordersEyebrow}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              {AUTH_COPY.ordersTitle}
            </h1>
            <p className="text-surface-400 max-w-xl text-sm leading-relaxed">
              {AUTH_COPY.ordersDescription}
            </p>
            <p className="text-surface-500 text-xs">
              {AUTH_COPY.ordersLoggedInAs} {claims.email ?? claims.sub}
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="border-surface-800 bg-surface-900/60 rounded-card border p-10 text-center">
          <p className="text-lg font-black text-white">{AUTH_COPY.ordersEmpty}</p>
        </div>
      </Container>
    </section>
  );
}
