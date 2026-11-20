# Technical decisions — Phases 1 and 2

## Scope

Phase 1 established the foundation only: tooling, folder structure, design tokens, UI/layout primitives, base layout, placeholder home page, and validation commands.

Phase 2 adds the Supabase backend foundation: local config, migrations, RLS, storage buckets and policies, generated database types, seed data, browser/server/admin clients, proxy-based session refresh and admin route protection, and a first-admin bootstrap script.

## Confirmed versions (2026-11-20)

| Area               | Package / version                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Package manager    | pnpm 12.21.0                                                                               |
| Framework          | next 16.4.6                                                                                |
| UI                 | react 19.3.1, react-dom 19.3.1                                                             |
| Styling            | tailwindcss 4.3.5, @tailwindcss/turbopack 4.3.5                                            |
| Lint               | eslint 9.39.5, eslint-config-next 16.4.6, typescript-eslint 8.73.0                         |
| Format             | prettier 3.10.1, prettier-plugin-tailwindcss 0.8.1                                         |
| TypeScript         | typescript7@npm:typescript@7.0.2 (CLI), typescript@npm:@typescript/typescript6@6.0.2 (API) |
| Supabase           | @supabase/supabase-js 2.119.2, @supabase/ssr 0.12.7, CLI 3.2.0                             |
| Validation / forms | zod 4.6.7, react-hook-form 7.92.0                                                          |
| Animation          | gsap 3.15.1, lenis 1.3.27                                                                  |
| Types              | @types/node 20.19.43, @types/react ^19, @types/react-dom ^19                               |

## Framework conventions confirmed

- **Next.js 16**: `middleware.ts` is deprecated/renamed to `proxy.ts`. When added in Phase 2+, place it at the project root or inside `src` at the same level as `app`, export a function named `proxy`, and expect the Node.js runtime by default. Edge runtime is not supported in proxy.
- **Next.js 16**: `next lint` is removed and `next build` no longer lints. Use `pnpm lint` (`eslint .`).
- **Next.js 16**: request APIs are async: `cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams`.
- **Next.js 16 caching**: `revalidateTag(tag, profile)` requires the second argument. `updateTag` is Server Actions-only for read-your-writes.
- **Turbopack** is the default bundler. The official `create-next-app` Tailwind CSS loader rule was retained in `next.config.ts`.
- `create-next-app` was run with `--ts --tailwind --eslint --app --src-dir --use-pnpm --import-alias @/* --agents-md` behavior, plus `--cache-components`. The generated `cacheComponents: true` and `partialPrefetching: true` settings were kept for now and should be revisited when dynamic data is introduced.

## Supabase conventions confirmed

- Current API key naming uses **publishable** keys (`sb_publishable_...`) and **secret** keys (`sb_secret_...`), not the older anon/service-role naming in new code.
- `@supabase/ssr` examples use `SUPABASE_PUBLISHABLE_KEY`; this project prefixes the public value as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` because the browser client will need it, while `SUPABASE_SECRET_KEY` remains server-only and never prefixed with `NEXT_PUBLIC_`.
- The current recommended server-side identity check is `getClaims()`. Do not trust `getSession()` or unverified session metadata for authorization in proxy, Server Actions, or RLS-adjacent code.
- The admin role is stored only in the Auth user's `app_metadata.role`; it is never a column in `public.profiles`.
- SQL helper `public.is_admin()` reads `auth.jwt() -> 'app_metadata' ->> 'role'` and is used by every admin write policy. The helper is `security definer` with `search_path = ''` and schema-qualified references.
- Client roles get explicit grants: `anon` and `authenticated` receive SELECT on exposed tables; `authenticated` also receives INSERT/UPDATE/DELETE so admins can write with the publishable key under RLS; `anon` has no write grants. `service_role` keeps full access and bypasses RLS.
- Public catalog/content reads are filtered by `is_published`/`is_active` plus publication and campaign time windows in the SELECT policies, not only in application queries.
- Storage buckets are declared in both `supabase/config.toml` and the storage migration with the same public flag, size limit, and MIME allow-list. `storage.objects` has public SELECT policies and admin-only write policies.
- `src/proxy.ts` exports `proxy` and delegates to `src/lib/supabase/proxy-session.ts`. It refreshes the session via `getClaims()` and redirects non-admins away from `/admin`.
- `src/lib/supabase/admin.ts` is guarded by `import "server-only"` and uses `SUPABASE_SECRET_KEY`; browser and proxy clients use only the publishable key.
- `pnpm db:types` runs `supabase gen types typescript --local --schema public` and formats the generated file. Generated types live in `src/lib/supabase/types.ts` and are excluded from ESLint's line limit.

## Styling / design decisions

- **Tailwind CSS v4** uses CSS-first theme tokens in `@theme`; there is no `tailwind.config.ts`. All colors, fonts, spacing, container width, radius, easing, and duration tokens live in `src/app/globals.css`.
- No hardcoded hex values in components. The only hex values are the design tokens in `globals.css`.
- Dark theme only via `color-scheme: dark`, black base, surface greys, electric green accent, and a darker green for hover/borders.
- Global focus-visible ring and reduced-motion overrides are defined in the base layer.
- `next/font` provides Geist and Geist Mono via CSS variables consumed by the Tailwind theme.

## Toolchain decisions and exceptions

- ESLint 10.15.0 is the newest stable ESLint, but `eslint-config-next@16.4.6` plugins declare peer ranges ending at ESLint 9. ESLint **9.39.5** is pinned so `pnpm peers check` is clean and linting is reliable.
- TypeScript 7.0.2 is current stable, but `typescript-eslint@8.73.0` requires the TypeScript 6 API. Following the official TypeScript 7 migration guidance, the project uses:
  - `typescript7` alias for the TS 7 CLI (`pnpm exec tsc --version` reports 7.0.2).
  - `typescript` alias for `@typescript/typescript6@6.0.2`, which satisfies typescript-eslint's programmatic API peer.
- `lib/env.ts` validates with Zod through `getEnv()` on first use and caches the result. Site URL validation is separate via `getSiteUrl()` so metadata generation and builds do not require Supabase secrets to be present. This keeps local builds portable while still validating every environment value before use.
- ESLint enforces `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`, `no-unused-vars: off`, `max-lines: 150` (blank/comment lines skipped), and `eqeqeq`.
- Prettier uses `prettier-plugin-tailwindcss` with ESM-safe JSON configuration.

## Documentation verification notes

Official docs were checked before implementation. Direct fetches to `supabase.com` and `tailwindcss.com` failed with transport/DNS errors in this environment, so the same official documentation was retrieved through the `r.jina.ai` read proxy. Package metadata was confirmed from the npm registry and package READMEs on unpkg.

- Next.js docs: local `node_modules/next/dist/docs/` plus official Next.js documentation.
- Supabase SSR guide: `https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs`.
- Supabase API keys: `https://supabase.com/docs/guides/getting-started/api-keys`.
- Tailwind theme: `https://tailwindcss.com/docs/theme`.
- TypeScript side-by-side guidance: `https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0`.
- create-next-app CLI options: `pnpm create next-app@latest --help`.

## Phase 2 verification

- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build` are the repository gates.
- Docker, Podman, and WSL are not available in this environment, so the full `pnpm db:start` Supabase stack could not be started here.
- To avoid leaving the database work unverified, migrations and `seed.sql` were applied to a clean temporary embedded PostgreSQL instance with Supabase-compatible roles, `auth` helpers, and `storage` tables. Anon SELECT returned only published rows (19 products, 9 categories, 2 active banners), anon INSERT was rejected with `42501`, and an authenticated user with `app_metadata.role = 'admin'` could insert.
- `src/lib/supabase/types.ts` was generated with Supabase CLI 3.2.0 from that seeded schema and then formatted with Prettier. Running `pnpm db:types` against a full local stack will regenerate the same public-schema shape.
- A fresh full-stack check is still required once Docker is available: `pnpm db:start && pnpm db:reset && pnpm db:types`.

## Open items for later phases

- Replace `.gitkeep` placeholders with real feature code.
- Add admin forms/actions that use `createAdminClient()` or verified admin claims for trusted mutations.
- Add the first real admin user with `pnpm admin:bootstrap` after `pnpm db:start`.
- Re-run the full local Supabase stack verification when a container runtime is available.
