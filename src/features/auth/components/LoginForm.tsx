"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/features/auth/actions/login";
import { AuthField } from "@/features/auth/components/AuthField";
import { AuthFormMessage } from "@/features/auth/components/AuthFormMessage";
import { SubmitButton } from "@/features/auth/components/SubmitButton";
import { initialAuthState } from "@/features/auth/lib/auth-state";
import { AUTH_COPY } from "@/features/auth/lib/copy";
import { NEXT_PARAM, ROUTES } from "@/lib/constants";

export function LoginForm({ next }: { next: string | null }) {
  const [state, formAction] = useActionState(loginAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name={NEXT_PARAM} value={next} /> : null}
      <AuthFormMessage state={state} />
      <AuthField
        id="login-email"
        name="email"
        label={AUTH_COPY.emailLabel}
        type="email"
        autoComplete="email"
        errors={state.fieldErrors.email}
      />
      <AuthField
        id="login-password"
        name="password"
        label={AUTH_COPY.passwordLabel}
        type="password"
        autoComplete="current-password"
        errors={state.fieldErrors.password}
      />
      <SubmitButton label={AUTH_COPY.loginSubmit} pendingLabel={AUTH_COPY.loginPending} />
      <p className="text-surface-400 text-center text-sm">
        {AUTH_COPY.noAccount}{" "}
        <Link href={ROUTES.signup} className="text-accent font-bold hover:underline">
          {AUTH_COPY.noAccountLink}
        </Link>
      </p>
    </form>
  );
}
