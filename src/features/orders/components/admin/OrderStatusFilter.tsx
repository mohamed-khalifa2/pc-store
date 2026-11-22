import { Button } from "@/components/ui/Button";
import { ALL_ORDER_STATUSES } from "@/features/orders/queries/get-admin-orders";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

type OrderStatusFilterProps = { status: string };

const SELECT_CLASS =
  "bg-surface-900 border-surface-700 h-10 w-full rounded-md border px-3 text-sm text-white focus-visible:ring-accent sm:w-52";

export function OrderStatusFilter({ status }: OrderStatusFilterProps) {
  return (
    <form method="GET" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label
        htmlFor="order-status-filter"
        className="text-surface-400 text-xs font-black uppercase"
      >
        Filter by status
      </label>
      <select id="order-status-filter" name="status" defaultValue={status} className={SELECT_CLASS}>
        <option value={ALL_ORDER_STATUSES}>All statuses</option>
        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" variant="secondary">
        Apply
      </Button>
    </form>
  );
}
