"use server";

import { redirect } from "next/navigation";

import type { AuthState } from "@/features/auth/lib/auth-state";
import { formString } from "@/features/auth/lib/form-data";
import { validationState } from "@/features/auth/lib/form-errors";
import { toFriendlyAuthMessage } from "@/features/auth/lib/messages";
import { safeNextPath } from "@/features/auth/lib/safe-next-path";
import { loginSchema } from "@/features/auth/lib/schemas";
import { NEXT_PARAM, ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formString(formData.get("email")),
    password: formString(formData.get("password")),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { status: "error", message: toFriendlyAuthMessage(error), fieldErrors: {} };
  }

  const next = safeNextPath(formData.get(NEXT_PARAM)) ?? ROUTES.orders;
  redirect(next);
}
