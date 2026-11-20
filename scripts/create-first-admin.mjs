import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ADMIN_ROLE = "admin";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_"),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

const argsSchema = z.object({
  email: z.email(),
});

async function main() {
  const env = envSchema.parse(process.env);
  const { email } = argsSchema.parse({ email: process.argv[2] });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: found, error: lookupError } = await supabase.auth.admin.getUserByEmail(email);

  if (lookupError) {
    throw lookupError;
  }

  if (found.user) {
    const { error } = await supabase.auth.admin.updateUserById(found.user.id, {
      app_metadata: {
        ...found.user.app_metadata,
        role: ADMIN_ROLE,
      },
    });

    if (error) {
      throw error;
    }

    console.log(`Granted admin role to ${email}.`);
    return;
  }

  if (!env.ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_PASSWORD is required when creating a new admin user (minimum 8 characters).",
    );
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password: env.ADMIN_PASSWORD,
    email_confirm: true,
    app_metadata: { role: ADMIN_ROLE },
  });

  if (error) {
    throw error;
  }

  console.log(`Created admin user ${email}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
