"use client";

import { startTransition, useEffect, useMemo, useState } from "react";

import { getCartDetails } from "@/features/cart/actions/get-cart-details";
import { parseCartItemsJson } from "@/features/cart/schemas/cart";
import type { CartDetailLine } from "@/features/cart/schemas/cart-details";
import type { CartItem } from "@/features/cart/schemas/cart";

type CartDetailsStatus = "loading" | "ready" | "error";

type CartDetailsState = {
  status: CartDetailsStatus;
  lines: CartDetailLine[];
};

type CartDetailsCache = CartDetailsState & {
  key: string;
  status: Exclude<CartDetailsStatus, "loading">;
};

const EMPTY_CACHE: CartDetailsCache = { key: "", lines: [], status: "ready" };

export function useCartDetails(items: CartItem[]): CartDetailsState {
  const key = JSON.stringify(items);
  const safeItems = useMemo(() => parseCartItemsJson(key), [key]);
  const [cache, setCache] = useState<CartDetailsCache>(EMPTY_CACHE);

  useEffect(() => {
    if (safeItems.length === 0) return;

    let active = true;
    startTransition(() => {
      void getCartDetails(safeItems)
        .then((lines) => {
          if (active) setCache({ key, lines, status: "ready" });
        })
        .catch(() => {
          if (active) setCache({ key, lines: [], status: "error" });
        });
    });

    return () => {
      active = false;
    };
  }, [key, safeItems]);

  if (safeItems.length === 0) return { status: "ready", lines: [] };
  if (cache.key !== key) return { status: "loading", lines: [] };

  return cache;
}
