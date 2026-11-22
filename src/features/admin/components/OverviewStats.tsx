import { formatEgp } from "@/lib/format/currency";

import type { AdminOverviewData } from "@/features/admin/queries/get-admin-overview";

type OverviewStat = {
  label: string;
  value: string;
  hint: string;
};

export function OverviewStats({ data }: { data: AdminOverviewData }) {
  const stats: OverviewStat[] = [
    {
      label: "Orders today",
      value: String(data.ordersToday),
      hint: "Placed since midnight UTC",
    },
    {
      label: "Revenue today",
      value: formatEgp(data.revenueToday),
      hint: "Across today's orders",
    },
    {
      label: "Low stock",
      value: String(data.lowStockProducts),
      hint: "Products at or below the stock threshold",
    },
    {
      label: "Pending",
      value: String(data.pendingOrders),
      hint: "Orders awaiting fulfilment",
    },
  ];

  return (
    <section aria-label="Store overview" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="border-surface-800 bg-surface-900/60 rounded-card border p-6"
        >
          <p className="text-surface-400 text-xs font-black tracking-[0.18em] uppercase">
            {stat.label}
          </p>
          <p className="mt-4 text-3xl font-black text-white sm:text-4xl">{stat.value}</p>
          <p className="text-surface-500 mt-3 text-xs">{stat.hint}</p>
        </article>
      ))}
    </section>
  );
}
