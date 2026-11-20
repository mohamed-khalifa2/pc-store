"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signupAction } from "@/features/auth/actions/signup";
import { AuthField } from "@/features/auth/components/AuthField";
import { AuthFormMessage } from "@/features/auth/components/AuthFormMessage";
import { SubmitButton } from "@/features/auth/components/SubmitButton";
import { initialAuthState } from "@/features/auth/lib/auth-state";
import { AUTH_COPY } from "@/features/auth/lib/copy";
import { ROUTES } from "@/lib/constants";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-5">
      <AuthFormMessage state={state} />
      <AuthField
        id="signup-name"
        name="fullName"
        label={AUTH_COPY.fullNameLabel}
        type="text"
        autoComplete="name"
        errors={state.fieldErrors.fullName}
      />
      <AuthField
        id="signup-email"
        name="email"
        label={AUTH_COPY.emailLabel}
        type="email"
        autoComplete="email"
        errors={state.fieldErrors.email}
      />
      <AuthField
        id="signup-password"
        name="password"
        label={AUTH_COPY.passwordLabel}
        type="password"
        autoComplete="new-password"
        errors={state.fieldErrors.password}
      />
      <SubmitButton label={AUTH_COPY.signupSubmit} pendingLabel={AUTH_COPY.signupPending} />
      <p className="text-surface-400 text-center text-sm">
        {AUTH_COPY.hasAccount}{" "}
        <Link href={ROUTES.login} className="text-accent font-bold hover:underline">
          {AUTH_COPY.hasAccountLink}
        </Link>
      </p>
    </form>
  );
}
