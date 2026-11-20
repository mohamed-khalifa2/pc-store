import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { AUTH_COPY } from "@/features/auth/lib/copy";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow={AUTH_COPY.signupEyebrow}
      title={AUTH_COPY.signupTitle}
      description={AUTH_COPY.signupDescription}
      footer={AUTH_COPY.adminNotice}
    >
      <SignupForm />
    </AuthShell>
  );
}
