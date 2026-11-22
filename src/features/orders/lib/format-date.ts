import { ORDER_COPY } from "@/features/orders/config/copy";

export function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(ORDER_COPY.dateLocale, { dateStyle: "medium" }).format(date);
}
