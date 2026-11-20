import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginFormContainer } from "@/features/auth/components/LoginFormContainer";
import { AUTH_COPY } from "@/features/auth/lib/copy";

export const metadata: Metadata = {
  title: "Sign in",
};

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <AuthShell
      eyebrow={AUTH_COPY.loginEyebrow}
      title={AUTH_COPY.loginTitle}
      description={AUTH_COPY.loginDescription}
      footer={AUTH_COPY.adminNotice}
    >
      <Suspense fallback={<p className="text-surface-400 text-sm">{AUTH_COPY.checkingAccess}</p>}>
        <LoginFormContainer searchParams={searchParams} />
      </Suspense>
    </AuthShell>
  );
}
