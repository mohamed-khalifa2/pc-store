# Technical decisions — Phases 1, 2, 3, and 4

## Scope

Phase 1 established the foundation only: tooling, folder structure, design tokens, UI/layout primitives, base layout, placeholder home page, and validation commands.

Phase 2 added the Supabase backend foundation: local config, migrations, RLS, storage buckets and policies, generated database types, seed data, browser/server/admin clients, proxy-based session refresh and admin route protection, and a first-admin bootstrap script.

Phase 3 added the auth experience: email/password forms backed by Server Actions, Zod validation with friendly messages, identity helpers built on `getClaims()`, a three-layer admin guard, and a customer account placeholder for orders.

Phase 4 adds the data-driven home page: tagged Supabase reads with typed defaults, a GSAP/Lenis scroll hero, parallax banner variants, all supporting home sections, section ordering from `home_sections`, and SEO metadata/JSON-LD.

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

## Phase 3 decisions

- Forms use Server Actions with React 19 `useActionState`; the pending state comes from `useFormStatus()` in the smallest client leaf (`SubmitButton`). No React Hook Form is needed for these two simple forms.
- Every auth action validates raw `FormData` with Zod on the server. Zod issues are converted to per-field messages with `z.flattenError()`; provider errors are converted with a code/message rule table in `features/auth/lib/messages.ts`.
- `getVerifiedClaims()` in `features/auth/lib/claims.ts` is the single server-side identity helper. It uses `supabase.auth.getClaims()` and returns a narrow DTO rather than exposing raw JWT claims.
- Admin protection has three independent layers: the proxy redirect, `requireAdmin()` in every admin layout/page, and the Phase 2 RLS policies. `requireUser()` uses the same helper for customer account pages.
- With `cacheComponents: true`, session readers live behind `<Suspense>` boundaries. The admin layout wraps its guard and shell in one boundary so non-admins never receive admin UI while the check is pending.
- The `next` redirect target is validated by `safeNextPath()` before being written to the login form or followed by the login action. Protocol-relative URLs, backslashes, and control characters are rejected.
- `AUTH_MESSAGES`, `AUTH_COPY`, and `NEXT_PARAM` centralize display copy and the redirect query key. A `--color-danger` token was added for form errors; no hex values appear in components.
- Login honors the `next` query parameter added by the proxy, so an anonymous `/admin` request returns to the requested admin page after sign-in.

## Phase 3 verification

- `pnpm check` and `pnpm build` pass. `/admin`, `/login`, and `/orders` are Partial Prerender routes; `/signup` is static.
- A dev-server smoke test with placeholder env values confirmed anonymous `GET /admin` returns `307` with `location: /login?next=%2Fadmin`, and anonymous `GET /orders` streams a redirect to `/login` from `requireUser()`.
- See `docs/MANUAL-TESTS.md` for the full role/redirect checklist and form flows.
- Authenticated admin/customer verification against a running Supabase stack is still manual because Docker is unavailable here.

## Phase 4 decisions

- Public Supabase reads use a dedicated `createPublicClient()` without cookies so they can run inside `use cache`. Cached functions call `cacheTag()` and `cacheLife("hours")`; cookies/headers remain outside cached scopes.
- Every external `jsonb`/row value is parsed with Zod and merged with a typed default. Empty tables, invalid rows, network failures, and missing env values render the typed defaults instead of throwing.
- Banner publication is governed by RLS (`is_active`, `published_at`, `starts_at`, `ends_at`); the schema has no `is_published` column, so the query filters only on `is_active` and lets RLS enforce the time window.
- `home_sections` was expanded with a forward-only migration. Legacy kinds are accepted in the database and normalized in `features/home/lib/normalize-section.ts`, so existing seed data cannot break the page.
- Banner variants are presentation config, not a database column. `features/home/queries/get-home-page-data.ts` applies section `config.variants` by index to the active banners.
- `next/dynamic` with `ssr: false` lives in `ScrollHeroLoader.tsx`, a small Client Component. The server page remains composition-only; `HeroStatic` is the loading fallback and the reduced-motion render.
- `next/image` uses `preload` only on the first hero part. `priority` is deprecated in this Next.js version and was not used.
- The hero is `240vh` on mobile and `400vh` on desktop. Mobile filters out non-essential parts; reduced motion renders the assembled static case and skips GSAP/Lenis entirely.
- GSAP timelines animate only transform/opacity. `will-change-transform` toggles only while a trigger is active; `ScrollTrigger` and Lenis are destroyed/reverted on unmount. Lenis is synced with `ScrollTrigger.update()` and `gsap.ticker`, with lag smoothing disabled while active.
- `usePrefersReducedMotion()` uses `useSyncExternalStore`; it returns `false` during SSR and reads the real media query on the client without an effect-driven setState render.
- Remote storage paths are resolved to public Supabase object URLs; remote image URLs are rendered with `unoptimized` and local paths use `next/image` optimization. All hrefs from content pass through `safeHref()`.
- Newsletter signup is intentionally local-only for Phase 4: it acknowledges submission without persisting data. Wiring it to a Server Action and Zod schema is a later phase decision.
- SEO metadata and Organization/WebSite JSON-LD come from `site_content` with typed fallbacks; JSON-LD is escaped by replacing `<` before injection.

## Phase 4 verification

- `pnpm check` and `pnpm build` pass. `/` is a static route with `1h` revalidate and `1d` expire from the cached public queries.
- A browser smoke test confirmed the home page renders every ordered section from fallback/default data, the dynamic hero loads, and there are no console errors.
- Automated scripted scrolling did not drive Lenis in the browser harness, so the scrubbed copy/part transitions were verified by code review rather than a scripted 60fps measurement.
- Lighthouse on the local page reports accessibility `1`, SEO `1`, and no listed failures after fixing the inverted CTA heading contrast and the cart link accessible-name mismatch.
- Lighthouse mobile performance and 60fps on a mid-range laptop remain unmeasured in this environment; no device emulation or representative hardware is available here.

## Open items for later phases

- Add admin forms/actions that use `createAdminClient()` or verified admin claims for trusted mutations, including revalidating `CACHE_TAGS`.
- Add the first real admin user with `pnpm admin:bootstrap` after `pnpm db:start`.
- Replace the placeholder SVG artwork with the transparent WebP renders described in `docs/PLACEHOLDER-ART.md`.
- Connect the newsletter form to a validated Server Action when the subscription data model exists.
- Measure Lighthouse mobile performance and scroll smoothness on representative hardware, then tune if either target is missed.
- Re-run the full local Supabase stack verification when a container runtime is available.
