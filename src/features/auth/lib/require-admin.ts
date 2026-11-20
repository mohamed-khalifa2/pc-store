import "server-only";

import { redirect } from "next/navigation";

import { getVerifiedClaims, type VerifiedClaims } from "@/features/auth/lib/claims";
import { ADMIN_ROLE, ROUTES } from "@/lib/constants";

export async function requireAdmin(): Promise<VerifiedClaims> {
  const claims = await getVerifiedClaims();

  if (!claims || claims.appMetadataRole !== ADMIN_ROLE) {
    redirect(ROUTES.login);
  }

  return claims;
}
