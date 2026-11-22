import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_PATH_PREFIX, ADMIN_ROLE, NEXT_PARAM, ROUTES } from "@/lib/constants";
import { getEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

const SECURITY_HEADERS = ["cache-control", "pragma", "expires"] as const;

function copyResponseState(source: NextResponse, target: NextResponse): void {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }

  for (const key of SECURITY_HEADERS) {
    const value = source.headers.get(key);
    if (value) {
      target.headers.set(key, value);
    }
  }
}

function isAdminRoute(pathname: string): boolean {
  return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
}

function applyNoStoreHeaders(response: NextResponse): void {
  response.headers.set("cache-control", "private, no-store, max-age=0, must-revalidate");
  response.headers.set("pragma", "no-cache");
  response.headers.set("expires", "0");
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const env = getEnv();
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          supabaseResponse = NextResponse.next({ request });

          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }

          for (const [key, value] of Object.entries(headers)) {
            supabaseResponse.headers.set(key, value);
          }
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const role = data?.claims.app_metadata?.role;
  const isAdmin = typeof role === "string" && role === ADMIN_ROLE;

  if (isAdminRoute(request.nextUrl.pathname) && !isAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = ROUTES.login;
    redirectUrl.searchParams.set(
      NEXT_PARAM,
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );

    const redirectResponse = NextResponse.redirect(redirectUrl);
    copyResponseState(supabaseResponse, redirectResponse);
    applyNoStoreHeaders(redirectResponse);
    return redirectResponse;
  }

  if (isAdminRoute(request.nextUrl.pathname)) applyNoStoreHeaders(supabaseResponse);

  return supabaseResponse;
}
