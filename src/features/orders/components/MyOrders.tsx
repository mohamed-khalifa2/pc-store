import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LinkButton } from "@/components/ui/LinkButton";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { requireUser } from "@/features/auth/lib/require-user";
import { ORDER_COPY } from "@/features/orders/config/copy";
import { OrdersList } from "@/features/orders/components/OrdersList";
import { getMyOrders } from "@/features/orders/queries/get-my-orders";
import { ROUTES } from "@/lib/constants";

export async function MyOrders() {
  const claims = await requireUser();
  const result = await getMyOrders();

  return (
    <section className="py-16 sm:py-24">
      <Container className="space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
              {ORDER_COPY.eyebrow}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              {ORDER_COPY.listTitle}
            </h1>
            <p className="text-surface-400 max-w-xl text-sm leading-relaxed">
              {ORDER_COPY.listDescription}
            </p>
            <p className="text-surface-500 text-xs">
              {ORDER_COPY.signedInAs} {claims.email ?? claims.sub}
            </p>
          </div>
          <LogoutButton />
        </header>

        {!result.ok ? (
          <ErrorState description={result.message} />
        ) : result.orders.length === 0 ? (
          <EmptyState
            title={ORDER_COPY.emptyTitle}
            description={ORDER_COPY.emptyDescription}
            action={<LinkButton href={ROUTES.products}>{ORDER_COPY.browseProducts}</LinkButton>}
          />
        ) : (
          <OrdersList orders={result.orders} />
        )}
      </Container>
    </section>
  );
}
