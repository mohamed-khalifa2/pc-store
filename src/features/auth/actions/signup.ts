"use server";

import { redirect } from "next/navigation";

import type { AuthState } from "@/features/auth/lib/auth-state";
import { authSuccessState } from "@/features/auth/lib/auth-state";
import { formString } from "@/features/auth/lib/form-data";
import { validationState } from "@/features/auth/lib/form-errors";
import { AUTH_MESSAGES, toFriendlyAuthMessage } from "@/features/auth/lib/messages";
import { signupSchema } from "@/features/auth/lib/schemas";
import { ROUTES } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function signupAction(_previous: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    fullName: formString(formData.get("fullName")),
    email: formString(formData.get("email")),
    password: formString(formData.get("password")),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: new URL(ROUTES.login, getSiteUrl()).toString(),
    },
  });

  if (error) {
    return { status: "error", message: toFriendlyAuthMessage(error), fieldErrors: {} };
  }

  if (!data.session) {
    return authSuccessState(AUTH_MESSAGES.checkEmail);
  }

  redirect(ROUTES.orders);
}
