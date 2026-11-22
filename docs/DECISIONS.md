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

## Phase 5 decisions

- Versions and conventions are unchanged from the confirmed table above (Next.js 16.4.6, React 19.3.1, Supabase JS 2.119.2 / SSR 0.12.7, Zod 4.6.7, Tailwind 4.3.5). Phase 5 re-read the bundled Next.js 16 guides for Server Actions/forms, Route Handlers, and revalidation before implementing.
- Server-side identity still uses `getClaims()` through `requireUser()`; checkout and order pages redirect anonymous users to `/login`. Order queries use the cookie client so RLS limits rows to the owner or an admin.
- `placeOrder` is a Server Action using React 19 `useActionState`. Raw `FormData` is parsed with Zod, cart JSON is re-parsed with the cart schema, and prices/stock are re-read with the uncached `getProductsByIds()` query. Client prices are never accepted.
- Totals are computed in integer piasters from server prices; the RPC independently derives line prices from `public.products` and returns the authoritative total. Out-of-stock, unknown, and duplicate lines are rejected before the RPC call.
- Invalidation follows the Next.js 16 rules: `revalidateTag(CACHE_TAGS.products, "max")` for catalog data and `updateTag(CACHE_TAGS.orders)` for read-your-own-writes in a Server Action.
- **Local RPC type caveat:** generated Supabase types cannot be regenerated without a container runtime here. The checkout RPC call uses a narrow local structural contract in `features/checkout/lib/place-order-rpc.ts`, validated with Zod. Rerun `pnpm db:types` when Docker is available and replace that contract with the generated `Functions.place_order` type.
- The PayMob adapter is an explicit stub: it reads `PAYMOB_API_KEY`, `PAYMOB_SECRET_KEY`, and `PAYMOB_INTEGRATION_ID` only through `getEnv()` on the server, reports itself unavailable, and throws a TODO error if invoked. COD is the only enabled provider and never redirects.
- The PayMob webhook is a `POST`-only Route Handler. It verifies a raw-body HMAC-SHA256 signature from `x-paymob-signature` with Web Crypto and a constant-time comparison before Zod validation; reconciliation is left as a documented TODO.
- Order routes are `noindex, nofollow` and wrap session readers in `<Suspense>` because Cache Components is enabled. After a successful order, the client clears the cart before navigating to the confirmation page.
- **Integration assumption:** checkout reads cart lines through `features/checkout/hooks/use-checkout-cart.ts`, which expects `useCartStore` from `features/cart/store/cart-store` to expose an `items` array and `useCartHydrated()` to report localStorage hydration. If the cart track names those exports differently, only this one adapter file needs changing. The cart summary comes from a checkout-only Server Action rather than `features/cart/actions/get-cart-details.ts` so this phase does not edit cart files and can surface stock/duplicate errors before placing an order.
- All server Supabase clients use a shared fetch wrapper with a 5-second timeout (`SUPABASE_REQUEST_TIMEOUT_MS`). Public reads fall back to typed local defaults when the remote database is unreachable, so pages stream instead of hanging. Checkout still sends only product IDs and quantities; prices are re-read from the server and the RPC remains the authoritative source. Cart hydration uses `useSyncExternalStore` rather than an effect-driven `setState`.
- **Integration fixes:** the category fallback now includes `parentId` and `sortOrder` so detail queries satisfy `CategoryDetailData`; `ShippingFields` imports `CheckoutFieldErrors` from its owning module; `CheckoutSummary` tracks the resolved cart key instead of setting state synchronously in an effect; URL `page` values are coerced with Zod.

## Phase 5 verification

- `pnpm check` and `pnpm build` pass after all integration fixes.
- Focused production-browser smoke test on `http://localhost:3002`: the catalog rendered from streamed Suspense content; URL filters (`category=cpus&q=ryzen&sort=price-asc&inStock=on&min=10000&max=20000&page=1`) reduced the list to one product; an impossible search rendered the true empty state; product detail showed price, stock, specs table, and JSON-LD; add-to-cart opened the drawer with a server-priced line; `localStorage` contained only `{ productId, quantity }`; the cart page showed the same line and subtotal; anonymous checkout redirected to `/login?next=/checkout`; an invalid product slug rendered the not-found state.
- The PayMob webhook returned `401` for a bad signature and `405` for `GET`, as designed.
- **Still blocked:** the configured remote Supabase project responds, but `public.products` is absent from its schema cache and public signup is rate-limited. With no migrated local stack (Docker/Podman/WSL unavailable), the authenticated COD order path, `/orders` list, stock decrement, atomic rollback, generated `Functions.place_order` types, and `pnpm db:reset` could not be verified end to end. Run `pnpm db:start && pnpm db:reset && pnpm db:types` where a container runtime is available, then repeat the checkout/orders smoke test before closing this phase.

## Phase 6 verified conventions (2026-11-20)

- Repo versions were re-confirmed against the npm registry and the existing Phase 1 table: Next.js `16.4.6`, Supabase JS `2.119.2`, React `19.3.1`, Tailwind CSS `4.3.5`, Zod `4.6.7`. No package upgrade is required for this phase.
- Next.js 16 bundled guides were re-read before implementation:
  - Server Actions are public POST endpoints, so every admin action calls `requireAdmin()` before parsing input and never trusts row contents supplied by the client.
  - `revalidateTag(tag, "max")` remains the recommended stale-while-revalidate form; admin pages use `updateTag()` where read-your-own-writes are required and `revalidateTag()` for public content.
  - Server Actions have a default 1 MB body limit. Multi-image uploads require a deliberate `serverActions.bodySizeLimit` increase in `next.config.ts`; Storage bucket limits remain the authoritative per-file constraint.
  - `export const metadata = { robots: { index: false, follow: false } }` is the supported way to mark the admin route tree `noindex`.
  - `middleware.ts` remains renamed to `proxy.ts` in Next.js 16; the existing `src/proxy.ts` is retained.
- Supabase Storage docs were re-read: `.upload(path, body, { upsert: false, contentType })` stores at a path, `.remove([path])` deletes by path, and `.getPublicUrl(path)` derives a URL from a stored path. Admin code stores only bucket-relative paths in Postgres and treats replace/delete as two-step upload-then-write operations with cleanup on failure.
- Official references checked: bundled `node_modules/next/dist/docs/01-app/{02-guides/server-actions.md,02-guides/forms.md,02-guides/data-security.md,02-guides/authentication.md,03-api-reference/04-functions/revalidateTag.md,03-api-reference/04-functions/generate-metadata.md}`, Supabase Storage `upload`/`remove`/`getPublicUrl`, Supabase SSR/API-key guides, Tailwind theme docs, and npm registry `latest` metadata.

## Phase 6 implementation decisions

- Admin mutations use the checkout-style `{ ok, error, fieldErrors, data? }` contract from `features/admin/lib/action-result`. `error` intentionally carries the user-facing success or failure message so one toast component can render both cases.
- `requireAdmin()` is always the first statement in an admin Server Action, before parsing or coercing any client input. Admin reads use `createAdminClient()` only after the layout/page guard, never the public cached client.
- `revalidatePublic()` calls `revalidateTag(tag, "max")` for cached storefront reads. `refreshAdminTag()` uses `updateTag()` for admin read-your-own-writes; `refreshAndRevalidate()` composes both.
- ImageUploader uploads files through a dedicated guarded Server Action before the parent form submits. Forms persist only bucket-relative storage paths; replace/delete actions remove stale objects with `.remove([...paths])` after the database write succeeds.
- `next.config.ts` sets `experimental.serverActions.bodySizeLimit` to `12mb` for multi-image forms. Per-file MIME and 5 MB checks remain in `features/admin/lib/storage.ts` and Storage bucket policies.
- Banners gained optional `mobile_image_path` and a `placement` enum via a forward-only migration: `202611200016_add_banner_admin_fields.sql`. Public banners are filtered by placement as well as RLS publication rules, and `Banner` now carries a separate `mobileImageUrl`.
- Hero and scroll-step copy is editable through new `site_content` keys. `getHeroSteps()` overlays those values on the static step config so the existing GSAP timeline and reduced-motion fallback do not branch on admin state.
- New admin screens are `noindex, nofollow` through the existing admin layout metadata. All admin routes stay behind the proxy, `requireAdmin()`, and RLS/admin-client boundaries.
- Storage validation is bucket-aware: product/banner uploads allow WebP, AVIF, JPEG, and PNG up to 5 MB; site-asset uploads additionally allow SVG up to 2 MB. The same limits are enforced in the uploader UI, the Server Action, and Storage policies.
- Overview “today” metrics use a UTC day boundary. `datetime-local` admin inputs are converted to ISO strings on submit and back to local input values when editing.
- New home sections start at `sort_order = 1000` and are repositioned with the shared sortable list. Section `body` JSON is intentionally not exposed in the form; only validated `config` fields are edited.
- Order status is the only mutable order field. Invoice printing uses Tailwind `print:` utilities and a fixed white overlay because the print route inherits the shared admin shell.
- Next.js 16 removed `export const dynamic = "force-dynamic"` when `cacheComponents` is enabled. Admin routes rely on the session read in the guarded layout under `<Suspense>`; no admin data is prerendered into the static shell. The proxy also sets `private, no-store` response headers for `/admin` requests and redirects.

## Phase 6 verification

- `pnpm check` and `pnpm build` pass after integrating all seven screens.
- Build route table shows every `/admin/*` route as Partial Prerender with dynamic server-streamed content; no admin route has a public revalidate/expire window.
- Static audit confirmed all 14 admin Server Action exports call `requireAdmin()` before parsing client input, and every `createAdminClient()` admin query also calls `requireAdmin()`.
- Admin route tree inherits `robots: { index: false, follow: false }` from `src/app/admin/layout.tsx`; product pages repeat it explicitly.
- `src/lib/supabase/types.ts` was synced locally with the banner migration columns (`mobile_image_path`, `placement`) because no container runtime is available to regenerate types. `Functions.place_order` remains a Phase 5 local contract.
- **Still blocked:** as in Phase 5, no migrated local Supabase stack and no usable remote schema are available here, so DB-backed smoke tests for all seven screens, storage replace/delete, cache revalidation, and crafted non-admin action requests remain manual. Run `pnpm db:start && pnpm db:reset && pnpm db:types`, then repeat those checks before considering the phase fully accepted.

## Phase 7 verified conventions (2026-11-21)

- Confirmed current stable package versions from npm metadata: `three@0.187.0`, `@react-three/fiber@9.8.2`, `meshoptimizer@1.3.0`, `@types/three@0.187.0`, and `@gltf-transform/cli@4.5.1`. React 19.3.1, Next.js 16.4.6, Tailwind 4.3.5, and Zod 4.6.7 remain unchanged.
- Official references re-read for this phase: R3F hooks and performance/pitfalls docs, glTF Transform CLI docs for `optimize`, `resize`, `webp`, and `meshopt`, and the bundled Next.js 16 lazy-loading guide. `@react-three/drei` was deliberately not added; only the smallest required loader/runtime pieces are used.
- The existing `next/dynamic` boundary around `ScrollHero` remains the lazy boundary for all R3F/Three code. GLBs are loaded only after that chunk mounts and WebGL support is confirmed; the SVG `HeroStatic` hero stays as the loading, reduced-motion, and no-WebGL fallback.

## Phase 7 implementation decisions

- Original GLBs under `public/images/hero/parts/` are untouched. `pnpm models:optimize` runs `scripts/optimize-hero-models.mjs`, which writes reproducible optimized copies to `public/models/` with Meshopt geometry, WebP textures, capped texture sizes, and per-part simplification ratios. Total payload dropped from about 99 MB to about 8.4 MB (case 810 KB, CPU 1.67 MB, GPU 317 KB, motherboard 6.11 MB, RAM 440 KB, SSD 36 KB).
- `EXT_meshopt_compression` is decoded with `MeshoptDecoder` from `meshoptimizer/decoder`, configured once through the R3F `useLoader` extension callback. No Draco decoder or extra asset is fetched.
- Source models use incompatible units and orientations, so `lib/normalize-model.ts` centers each scene and fits it to a configured source-space size before a per-part base rotation. The case is rendered translucent so internal parts remain legible in the assembled state.
- Scroll progress is written from GSAP `ScrollTrigger.onUpdate`/`onRefresh` into a mutable `HeroRuntime` object; no React state is set in frame or event loops. Subscribers (the R3F renderer) are invalidated only when progress or clamped rotation actually changes.
- Explosion is a reversible scrub: progress 0 is assembled, progress 1 is exploded, and scrolling back returns the exact same transform set. Part positions and the whole-assembly rotation are mutated directly in `useFrame`.
- Drag and arrow keys rotate the entire assembly with clamped X/Y limits; there is no free drag, pan, or zoom. `touch-pan-y` preserves vertical touch scrolling. The stage is focusable and exposes the interaction to assistive technology.
- Rendering uses `frameloop="demand"` with DPR capped to `[1, 1.5]`. An IntersectionObserver and `visibilitychange` switch the frameloop to `never` when the hero is offscreen or the tab is hidden, and invalidate once when it resumes.
- `HeroCopy` and the original GSAP/Lenis integration are preserved; only the old SVG part-tween timeline was removed. Admin and Phase 6 files were left untouched.
- A DOM-level `<Suspense>` boundary wraps `<Canvas>` itself, with `HeroStage` as its fallback. A Suspense boundary only inside the R3F tree lets the nearest outer boundary hide the canvas while GLBs load; that unmounts the WebGL root and leaves it inactive after loading, producing a blank canvas after the SVG fallback disappears.

## Phase 7 verification

- `pnpm check` and `pnpm build` pass after adding the 3D hero, dependencies, optimization script, and generated GLBs.
- Production-browser smoke test on `http://localhost:3300`: all six optimized GLBs loaded with HTTP 200, the WebGL canvas mounted, and no console errors were reported.
- Pixel-signature comparison at scroll 0 → 800 → 0 returned the exact same assembled signature before and after the round trip, while the mid-scroll signature differed, confirming reversible scrubbed explosion.
- Repeated pointer drags converged to a stable signature after reaching the clamp, so the rotation limit holds. Keyboard arrow rotation and the focusable drag region are present.
- Final production smoke test on `http://localhost:3500` mounted one WebGL canvas and the focusable drag group with no console errors. Lighthouse reported accessibility `1`, best practices `1`, SEO `1`, and no listed failures.
- Local-run follow-up: after the SVG fallback disappeared, the canvas was blank because the R3F root was left inactive when its loader suspended past the canvas. Moving the Suspense boundary outside `<Canvas>` fixed it; a headless production capture now shows the assembled case in the hero region where the pre-fix capture was blank.
- Lighthouse mobile performance and a true 60fps measurement on representative hardware remain unmeasured in this environment, as in earlier phases.
