"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-styles";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { adminFailure, type AdminActionResult } from "@/features/admin/lib/action-result";

type AdminActionButtonProps = {
  action: () => Promise<AdminActionResult>;
  label: string;
  pendingLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

export function AdminActionButton({
  action,
  label,
  pendingLabel = ADMIN_COPY.saving,
  variant = "secondary",
  size = "sm",
  disabled,
}: AdminActionButtonProps) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AdminActionResult | null>(null);

  async function handleClick() {
    setPending(true);
    try {
      setResult(await action());
    } catch {
      setResult(adminFailure(ADMIN_COPY.unexpectedError));
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={disabled || pending}
        aria-busy={pending}
      >
        {pending ? pendingLabel : label}
      </Button>
      <AdminToast result={result} onDismiss={() => setResult(null)} />
    </>
  );
}
