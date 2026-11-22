import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/features/orders/schemas/order";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge>{ORDER_STATUS_LABELS[status]}</Badge>;
}
