import { z } from "zod";

import { DEFAULT_SITE_URL } from "@/lib/constants";

const siteUrlSchema = z.url();

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: siteUrlSchema.default(DEFAULT_SITE_URL),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().startsWith("sb_publishable_"),
});

const envSchema = publicEnvSchema.extend({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type Env = z.infer<typeof envSchema>;

let cachedPublicEnv: PublicEnv | undefined;
let cachedEnv: Env | undefined;

export function getPublicEnv(): PublicEnv {
  cachedPublicEnv ??= publicEnvSchema.parse(process.env);
  return cachedPublicEnv;
}

export function getEnv(): Env {
  cachedEnv ??= envSchema.parse(process.env);
  return cachedEnv;
}

export function getSiteUrl(): string {
  return siteUrlSchema.parse(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL);
}
