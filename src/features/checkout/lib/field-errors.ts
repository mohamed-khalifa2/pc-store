import type { z } from "zod";

import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { CHECKOUT_FIELDS } from "@/lib/constants";

export type CheckoutFieldName = (typeof CHECKOUT_FIELDS)[keyof typeof CHECKOUT_FIELDS];
export type CheckoutFieldErrors = Partial<Record<CheckoutFieldName, string[]>>;

const FIELD_NAMES = Object.values(CHECKOUT_FIELDS) as readonly CheckoutFieldName[];

function isCheckoutFieldName(value: unknown): value is CheckoutFieldName {
  return typeof value === "string" && FIELD_NAMES.includes(value as CheckoutFieldName);
}

export function fieldError(
  field: CheckoutFieldName,
  message: string,
): {
  ok: false;
  message: string;
  fieldErrors: CheckoutFieldErrors;
} {
  return { ok: false, message, fieldErrors: { [field]: [message] } };
}

export function validationError(error: z.ZodError): {
  ok: false;
  message: string;
  fieldErrors: CheckoutFieldErrors;
} {
  const fieldErrors: CheckoutFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (!isCheckoutFieldName(field)) {
      continue;
    }
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return { ok: false, message: CHECKOUT_COPY.checkFields, fieldErrors };
}
