import type { AuthState } from "@/features/auth/lib/auth-state";

export function AuthFormMessage({ state }: { state: AuthState }) {
  if (!state.message) {
    return null;
  }

  const isSuccess = state.status === "success";

  return (
    <p
      role={isSuccess ? "status" : "alert"}
      className={
        isSuccess
          ? "border-accent-strong bg-accent/10 text-accent-soft rounded-md border p-3 text-sm font-semibold"
          : "border-danger bg-danger/10 text-danger rounded-md border p-3 text-sm font-semibold"
      }
    >
      {state.message}
    </p>
  );
}
