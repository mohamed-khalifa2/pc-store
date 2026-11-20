import type { AuthError } from "@supabase/supabase-js";

export const AUTH_MESSAGES = {
  invalidCredentials: "That email and password don't match. Please try again.",
  emailNotConfirmed: "Please confirm your email address before signing in.",
  accountExists: "An account with that email already exists. Try signing in instead.",
  rateLimited: "Too many attempts. Please wait a moment and try again.",
  checkEmail: "Check your inbox to confirm your email address, then sign in.",
  checkFields: "Please fix the highlighted fields and try again.",
  generic: "Something went wrong. Please try again.",
} as const;

type MessageRule = {
  codes: readonly string[];
  fragments: readonly string[];
  message: string;
};

const MESSAGE_RULES: readonly MessageRule[] = [
  {
    codes: ["invalid_credentials", "invalid_grant"],
    fragments: ["invalid login credentials"],
    message: AUTH_MESSAGES.invalidCredentials,
  },
  {
    codes: ["email_not_confirmed"],
    fragments: ["email not confirmed"],
    message: AUTH_MESSAGES.emailNotConfirmed,
  },
  {
    codes: ["user_already_exists", "identity_already_exists"],
    fragments: ["already registered", "already exists"],
    message: AUTH_MESSAGES.accountExists,
  },
  {
    codes: ["over_request_rate_limit", "rate_limit_exceeded"],
    fragments: ["too many requests", "rate limit"],
    message: AUTH_MESSAGES.rateLimited,
  },
];

export function toFriendlyAuthMessage(error: AuthError): string {
  const code = error.code?.toLowerCase() ?? "";
  const text = error.message.toLowerCase();

  for (const rule of MESSAGE_RULES) {
    if (rule.codes.includes(code) || rule.fragments.some((fragment) => text.includes(fragment))) {
      return rule.message;
    }
  }

  return AUTH_MESSAGES.generic;
}
