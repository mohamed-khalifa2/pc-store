"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { adminFailure, type AdminActionResult } from "@/features/admin/lib/action-result";

type ConfirmDialogProps = {
  action: () => Promise<AdminActionResult>;
  title: string;
  description: string;
  triggerLabel?: string;
};

export function ConfirmDialog({
  action,
  title,
  description,
  triggerLabel = ADMIN_COPY.delete,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AdminActionResult | null>(null);

  async function handleConfirm() {
    setPending(true);
    try {
      const next = await action();
      setResult(next);
      if (next.ok) dialogRef.current?.close();
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
        variant="ghost"
        size="sm"
        onClick={() => dialogRef.current?.showModal()}
      >
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={`dialog-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="border-surface-700 bg-surface-900 rounded-card w-[min(92vw,30rem)] p-6 text-white backdrop:bg-black/80"
      >
        <h2
          id={`dialog-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-xl font-black"
        >
          {title}
        </h2>
        <p className="text-surface-400 mt-3 text-sm">{description}</p>
        <div className="mt-8 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => dialogRef.current?.close()}
          >
            {ADMIN_COPY.cancel}
          </Button>
          <Button type="button" size="sm" onClick={handleConfirm} disabled={pending}>
            {pending ? ADMIN_COPY.saving : ADMIN_COPY.confirm}
          </Button>
        </div>
      </dialog>
      <AdminToast result={result} onDismiss={() => setResult(null)} />
    </>
  );
}
