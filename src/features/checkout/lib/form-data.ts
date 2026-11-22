import type { CheckoutFieldName } from "@/features/checkout/lib/field-errors";

export function checkoutFormValue(formData: FormData, field: CheckoutFieldName): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}
