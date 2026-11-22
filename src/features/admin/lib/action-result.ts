import type { z } from "zod";

export type AdminFieldErrors = Record<string, string[]>;

export type AdminActionResult<T = null> = {
  ok: boolean;
  error: string | null;
  fieldErrors: AdminFieldErrors;
  data?: T;
};

export const initialAdminResult: AdminActionResult = {
  ok: true,
  error: null,
  fieldErrors: {},
};

export function adminSuccess<T>(message: string, data?: T): AdminActionResult<T> {
  return { ok: true, error: message, fieldErrors: {}, data };
}

export function adminFailure<T = null>(
  error: string,
  fieldErrors: AdminFieldErrors = {},
): AdminActionResult<T> {
  return { ok: false, error, fieldErrors };
}

export function adminValidation<T = null>(
  error: z.ZodError,
  summary = "Check the highlighted fields.",
): AdminActionResult<T> {
  const fieldErrors: AdminFieldErrors = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
  }

  return adminFailure<T>(summary, fieldErrors);
}
