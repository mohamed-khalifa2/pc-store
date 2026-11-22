import { ORDER_COPY } from "@/features/orders/config/copy";
import { formatEgp } from "@/lib/format/currency";

export function OrderTotals({ totalEgp }: { totalEgp: number }) {
  return (
    <div className="border-surface-800 bg-surface-900/60 rounded-card flex items-center justify-between border p-6">
      <span className="text-surface-200 text-sm font-bold">{ORDER_COPY.totalLabel}</span>
      <span className="text-accent text-2xl font-black" aria-live="polite">
        {formatEgp(totalEgp)}
      </span>
    </div>
  );
}
