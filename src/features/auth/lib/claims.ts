import "server-only";

import { createClient } from "@/lib/supabase/server";

export type VerifiedClaims = {
  sub: string;
  email?: string;
  role: string;
  appMetadataRole?: string;
};

export async function getVerifiedClaims(): Promise<VerifiedClaims | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  const claims = data.claims;
  const appMetadataRole = claims.app_metadata?.role;

  return {
    sub: claims.sub,
    email: claims.email,
    role: claims.role,
    appMetadataRole: typeof appMetadataRole === "string" ? appMetadataRole : undefined,
  };
}
