"use client";

import { useEffect, useState } from "react";

import type { AdminActionResult } from "@/features/admin/lib/action-result";

const AUTO_DISMISS_MS = 5000;

type AdminToastProps = {
  result: AdminActionResult<unknown> | null;
  onDismiss?: () => void;
};

export function AdminToast({ result, onDismiss }: AdminToastProps) {
  const [visible, setVisible] = useState(true);
  const [lastResult, setLastResult] = useState(result);

  if (result !== lastResult) {
    setLastResult(result);
    setVisible(true);
  }

  useEffect(() => {
    if (!result || !visible) return;

    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, AUTO_DISMISS_MS);

    return () => window.clearTimeout(timer);
  }, [result, visible, onDismiss]);

  function dismiss() {
    setVisible(false);
    onDismiss?.();
  }

  if (!result || !visible) return null;

  return (
    <div
      role={result.ok ? "status" : "alert"}
      aria-live={result.ok ? "polite" : "assertive"}
      className="border-surface-700 bg-surface-900 fixed right-4 bottom-4 z-[100] max-w-sm rounded-lg border px-5 py-4 shadow-2xl sm:right-8 sm:bottom-8"
    >
      <p className="text-sm font-bold text-white">{result.error}</p>
      <button
        type="button"
        onClick={dismiss}
        className="text-surface-400 hover:text-accent mt-2 text-xs font-black tracking-widest uppercase"
      >
        Dismiss
      </button>
    </div>
  );
}
