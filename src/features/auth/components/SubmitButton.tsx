"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

type SubmitButtonProps = {
  label: string;
  pendingLabel: string;
};

export function SubmitButton({ label, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
