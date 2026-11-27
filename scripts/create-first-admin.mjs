import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const ADMIN_ROLE = "admin";
const USER_PAGE_SIZE = 200;
const MAX_USER_PAGES = 50;

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_"),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

const argsSchema = z.object({
  email: z.email(),
});

async function findUserByEmail(supabase, email) {
  for (let page = 1; page <= MAX_USER_PAGES; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: USER_PAGE_SIZE,
    });

    if (error) throw error;

    const match = data.users.find((candidate) => candidate.email === email);
    if (match || data.users.length < USER_PAGE_SIZE) return match ?? null;
  }

  return null;
}

async function main() {
  const env = envSchema.parse(process.env);
  const { email } = argsSchema.parse({ email: process.argv[2] });

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const found = await findUserByEmail(supabase, email);

  if (found) {
    const { error } = await supabase.auth.admin.updateUserById(found.id, {
      app_metadata: {
        ...found.app_metadata,
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
