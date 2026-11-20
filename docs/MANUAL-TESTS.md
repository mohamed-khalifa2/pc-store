# Manual test checklist — Phase 3 (Auth and route protection)

## Setup

- [ ] `pnpm db:start && pnpm db:reset && pnpm db:types`
- [ ] Copy the local URL, publishable key, and secret key from `pnpm supabase status` into `.env.local`.
- [ ] `pnpm admin:bootstrap admin@example.com` (or set `ADMIN_PASSWORD` to create a new admin).
- [ ] Sign up a normal customer at `/signup` and confirm the email if confirmation is enabled.
- [ ] `pnpm dev`

## Role and redirect checks

| #   | Starting state                                      | Step                                             | Expected result                                                            |
| --- | --------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| 1   | Signed out                                          | Visit `/admin`                                   | Redirected to `/login?next=%2Fadmin`. No admin UI is visible.              |
| 2   | Signed in as a normal customer                      | Visit `/admin`                                   | Redirected away by the proxy; no admin UI is visible.                      |
| 3   | Signed in as a normal customer, JavaScript disabled | Force a reload of `/admin`                       | Still redirected; `requireAdmin()` blocks the page even without the proxy. |
| 4   | Signed in as an admin (role in `app_metadata`)      | Visit `/admin`                                   | Admin shell and overview render.                                           |
| 5   | Signed in as an admin                               | Open browser devtools and inspect the JWT claims | `app_metadata.role` is `admin`; the role is not editable from `/admin`.    |
| 6   | Signed out                                          | Visit `/orders`                                  | Redirected to `/login`; no order placeholder is shown.                     |
| 7   | Signed in as a customer                             | Visit `/orders`                                  | "My orders" placeholder with the signed-in email is shown.                 |

## Login and signup

- [ ] Submit `/login` with an empty password → inline "Enter your password." error; no redirect.
- [ ] Submit `/login` with a malformed email → inline "Enter a valid email address." error.
- [ ] Submit `/login` with wrong credentials → friendly "That email and password don't match" message.
- [ ] Submit `/login` with correct credentials → redirected to `/orders`.
- [ ] After being redirected from `/admin`, sign in with an admin account → returns to `/admin`.
- [ ] Submit `/signup` with a password shorter than 8 characters → inline password error.
- [ ] Submit `/signup` with an existing email → friendly "already exists / sign in" message.
- [ ] Submit `/signup` with a new email → either signed in and redirected to `/orders`, or the "check your inbox" message when email confirmation is enabled.
- [ ] Click "Log out" in the admin shell or `/orders` → redirected to the home page; `/admin` is protected again.

## Session and defense in depth

- [ ] Stay on an authenticated page past the access-token lifetime; the proxy refreshes the session without signing the user out.
- [ ] Confirm that no `SUPABASE_SECRET_KEY` value appears in browser source, network requests, or client bundles.
- [ ] Confirm static assets (`/_next/static/*`, images, fonts) do not trigger the proxy.
- [ ] In the Supabase SQL editor, run `select public.is_admin();` as a normal authenticated user → `false`; as an admin → `true`.
- [ ] Attempt an anon insert into `public.products` → rejected (RLS/grants), matching Phase 2.

## Automated gates

```bash
pnpm check
pnpm build
```
