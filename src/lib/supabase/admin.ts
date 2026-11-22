import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getEnv } from "@/lib/env";
import { fetchWithTimeout } from "@/lib/supabase/fetch-with-timeout";
import type { Database } from "@/lib/supabase/types";

export function createAdminClient() {
  const env = getEnv();

  return createSupabaseClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: { fetch: fetchWithTimeout },
  });
}
