import Link from "next/link";

import { CART_COUNT_PLACEHOLDER, NAV_LABELS, ROUTES } from "@/lib/constants";

type CartIndicatorProps = {
  count?: number;
};

export function CartIndicator({ count = CART_COUNT_PLACEHOLDER }: CartIndicatorProps) {
  return (
    <Link
      href={ROUTES.cart}
      aria-label={`${NAV_LABELS.cart}, ${count} items`}
      className="hover:text-accent inline-flex items-center gap-2 text-sm font-bold tracking-[0.12em] text-white uppercase"
    >
      <span className="hidden sm:inline">{NAV_LABELS.cart}</span>
      <span className="bg-accent text-black-950 grid size-6 place-items-center rounded-full text-xs font-black">
        {count}
      </span>
    </Link>
  );
}
