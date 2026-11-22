"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCheckoutSummary } from "@/features/checkout/actions/get-checkout-summary";
import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { initialCheckoutSummary, type CheckoutSummaryState } from "@/features/checkout/types";
import { ROUTES } from "@/lib/constants";
import { formatEgp } from "@/lib/format/currency";

type SummaryCache = {
  key: string;
  state: CheckoutSummaryState;
};

export function CheckoutSummary({ itemsJson, enabled }: { itemsJson: string; enabled: boolean }) {
  const [cache, setCache] = useState<SummaryCache>({ key: "", state: initialCheckoutSummary });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;

    void getCheckoutSummary(itemsJson).then((result) => {
      if (active) {
        setCache({ key: itemsJson, state: result });
      }
    });

    return () => {
      active = false;
    };
  }, [itemsJson, enabled]);

  if (!enabled || cache.key !== itemsJson) {
    return <Skeleton className="h-80 w-full" aria-label={CHECKOUT_COPY.summaryLoading} />;
  }

  const summary = cache.state;

  if (summary.status === "idle") {
    return <Skeleton className="h-80 w-full" aria-label={CHECKOUT_COPY.summaryLoading} />;
  }

  if (summary.status === "empty" || summary.status === "error") {
    return (
      <EmptyState
        title={summary.status === "empty" ? CHECKOUT_COPY.cartEmpty : CHECKOUT_COPY.summaryTitle}
        description={summary.message ?? undefined}
        action={<LinkButton href={ROUTES.products}>{CHECKOUT_COPY.cartEmptyLink}</LinkButton>}
      />
    );
  }

  return (
    <div className="border-surface-800 bg-surface-900/60 rounded-card border p-6">
      <h2 className="text-lg font-black text-white">{CHECKOUT_COPY.summaryTitle}</h2>
      <ul className="border-surface-800 mt-6 divide-y border-t">
        {summary.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4 py-4 text-sm">
            <div className="min-w-0">
              <p className="truncate font-bold text-white">{item.name}</p>
              <p className="text-surface-400 text-xs">
                {item.sku} · {CHECKOUT_COPY.quantityLabel} {item.quantity}
              </p>
            </div>
            <p className="text-accent shrink-0 font-bold">{formatEgp(item.lineTotalEgp)}</p>
          </li>
        ))}
      </ul>
      <div className="border-surface-800 mt-2 flex items-center justify-between border-t pt-5">
        <span className="text-surface-200 text-sm font-bold">{CHECKOUT_COPY.totalLabel}</span>
        <span className="text-accent text-2xl font-black" aria-live="polite">
          {formatEgp(summary.totalEgp)}
        </span>
      </div>
    </div>
  );
}
