"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { CartIcon } from "@/components/ui/icons/CartIcon";
import { CartLineList } from "@/features/cart/components/CartLineList";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";
import { CART_COPY } from "@/features/cart/config/cart-config";
import { useCartDetails } from "@/features/cart/hooks/use-cart-details";
import type { CartItem } from "@/features/cart/schemas/cart";
import { ROUTES } from "@/lib/constants";

type CartDetailsProps = {
  items: CartItem[];
};

export function CartDetails({ items }: CartDetailsProps) {
  const { status, lines } = useCartDetails(items);

  if (status === "loading") return <CartSkeleton />;

  if (status === "error") {
    return (
      <EmptyState
        title={CART_COPY.loadErrorTitle}
        description={CART_COPY.loadErrorDescription}
        action={
          <LinkButton href={ROUTES.products} size="sm">
            {CART_COPY.shopProducts}
          </LinkButton>
        }
      />
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<CartIcon className="size-6" />}
        title={CART_COPY.emptyTitle}
        description={CART_COPY.emptyDescription}
        action={
          <LinkButton href={ROUTES.products} size="sm">
            {CART_COPY.shopProducts}
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <CartLineList lines={lines} />
      <CartSummary lines={lines} />
    </div>
  );
}
