import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Enter your password." }),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(80, { error: "Name must be 80 characters or fewer." }),
  email: z.email({ error: "Enter a valid email address." }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(128, { error: "Password must be 128 characters or fewer." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
