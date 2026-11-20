import { LoginForm } from "@/features/auth/components/LoginForm";
import { safeNextPath } from "@/features/auth/lib/safe-next-path";
import { NEXT_PARAM } from "@/lib/constants";

type LoginSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function LoginFormContainer({ searchParams }: { searchParams: LoginSearchParams }) {
  const params = await searchParams;
  const rawNext = params[NEXT_PARAM];
  const nextValue = Array.isArray(rawNext) ? rawNext[0] : rawNext;

  return <LoginForm next={safeNextPath(nextValue)} />;
}
