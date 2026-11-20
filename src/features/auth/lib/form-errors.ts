import type { z } from "zod";

import type { AuthFieldErrors, AuthState } from "@/features/auth/lib/auth-state";
import { AUTH_MESSAGES } from "@/features/auth/lib/messages";

const FIELD_NAMES = ["fullName", "email", "password"] as const;

type AuthFieldName = (typeof FIELD_NAMES)[number];

function isAuthFieldName(value: unknown): value is AuthFieldName {
  return typeof value === "string" && FIELD_NAMES.includes(value as AuthFieldName);
}

export function fieldErrorsFrom(error: z.ZodError): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (isAuthFieldName(field)) {
      const messages = fieldErrors[field] ?? [];
      messages.push(issue.message);
      fieldErrors[field] = messages;
    }
  }

  return fieldErrors;
}

export function validationState(error: z.ZodError): AuthState {
  return {
    status: "error",
    message: AUTH_MESSAGES.checkFields,
    fieldErrors: fieldErrorsFrom(error),
  };
}
