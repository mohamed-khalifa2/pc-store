"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-styles";

type AdminSubmitButtonProps = {
  label: string;
  pendingLabel: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function AdminSubmitButton({
  label,
  pendingLabel,
  variant = "primary",
  size = "md",
  className,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}
