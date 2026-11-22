"use client";

import { useEffect } from "react";

import type { AdminActionResult } from "@/features/admin/lib/action-result";

type AdminToastProps = {
  result: AdminActionResult<unknown> | null;
  onDismiss?: () => void;
};

export function AdminToast({ result, onDismiss }: AdminToastProps) {
  useEffect(() => {
    if (!result?.error || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [result, onDismiss]);

  if (!result?.error) return null;

  return (
    <div
      role={result.ok ? "status" : "alert"}
      className="border-surface-700 bg-surface-900 fixed right-4 bottom-4 z-[100] max-w-sm rounded-lg border px-5 py-4 shadow-2xl sm:right-8 sm:bottom-8"
    >
      <p className="text-sm font-bold text-white">{result.error}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="text-surface-400 hover:text-accent mt-2 text-xs font-black tracking-widest uppercase"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
