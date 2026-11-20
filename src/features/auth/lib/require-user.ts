import "server-only";

import { redirect } from "next/navigation";

import { getVerifiedClaims, type VerifiedClaims } from "@/features/auth/lib/claims";
import { ROUTES } from "@/lib/constants";

export async function requireUser(): Promise<VerifiedClaims> {
  const claims = await getVerifiedClaims();

  if (!claims) {
    redirect(ROUTES.login);
  }

  return claims;
}
