import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LinkButton } from "@/components/ui/LinkButton";
import { requireUser } from "@/features/auth/lib/require-user";
import { ORDER_COPY } from "@/features/orders/config/copy";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import { OrderItemsList } from "@/features/orders/components/OrderItemsList";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { OrderTotals } from "@/features/orders/components/OrderTotals";
import { formatOrderDate } from "@/features/orders/lib/format-date";
import { getOrderById } from "@/features/orders/queries/get-order-by-id";
import { ROUTES } from "@/lib/constants";

export async function OrderDetail({ orderId }: { orderId: string }) {
  const claims = await requireUser();
  const result = await getOrderById(orderId);

  if (!result.ok) {
    return (
      <section className="py-16 sm:py-24">
        <Container>
          {result.notFound ? (
            <EmptyState
              title={ORDER_COPY.detailNotFound}
              description={ORDER_COPY.detailNotFoundDescription}
              action={<LinkButton href={ROUTES.orders}>{ORDER_COPY.backToOrders}</LinkButton>}
            />
          ) : (
            <ErrorState description={result.message} />
          )}
        </Container>
      </section>
    );
  }

  const { order } = result;

  return (
    <section className="py-16 sm:py-24">
      <Container className="space-y-8">
        <header className="space-y-4">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
            {ORDER_COPY.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            {ORDER_COPY.detailTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <p className="font-mono text-sm font-bold text-white">{order.order_number}</p>
            <OrderStatusBadge status={order.status} />
            <p className="text-surface-400 text-xs">
              {ORDER_COPY.placedLabel} {formatOrderDate(order.placed_at)}
            </p>
          </div>
          <LinkButton href={ROUTES.orders} variant="secondary" size="sm">
            {ORDER_COPY.backToOrders}
          </LinkButton>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <OrderAddress
            address={order.shipping_address}
            email={order.customer_email}
            phone={order.customer_phone}
          />
          <OrderItemsList items={order.order_items} />
        </div>

        <OrderTotals totalEgp={order.total_egp} />
        <p className="text-surface-500 text-xs">
          {ORDER_COPY.signedInAs} {claims.email ?? claims.sub}
        </p>
      </Container>
    </section>
  );
}
