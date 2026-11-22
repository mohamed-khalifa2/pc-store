# Architecture — Phases 1, 2, 3, and 4

## Principles

- Server Components by default. `"use client"` only on the smallest interactive leaf (for example `MobileNav`, `error.tsx`, `ScrollHeroLoader`, `ParallaxBanner`, and `NewsletterSection`).
- Pages compose; they do not contain business logic.
- One component per file, one responsibility per file, maximum ~150 code lines per file (lint-enforced).
- Shared UI is dumb and reusable. Feature-specific UI stays under `src/features/<feature>/`.
- Components never call Supabase directly. Reads live in `features/*/queries`; mutations live in `features/*/actions` as Server Actions.
- External input is validated with Zod on the server before use.
- No `any`, unused code, commented-out code, barrel-file cycles, or magic strings. Repeated strings live in `src/lib/constants.ts` or a feature config file.

## Route structure

- `src/app/layout.tsx`: root HTML shell, `next/font`, metadata, global CSS.
- `src/app/(store)/layout.tsx`: public store shell with `Header`, `main`, and `Footer`.
- `src/app/(store)/page.tsx`: composition-only home page; it fetches `getHomePageData()` and renders sections in `home_sections.sort_order`.
- `src/app/(auth)/login` and `src/app/(auth)/signup`: auth forms composed from `features/auth`.
- `src/app/(store)/orders/page.tsx`: guarded customer account placeholder.
- `src/app/admin/`: guarded admin shell and overview page.
- `src/app/api/`: Route Handlers only when truly needed (for example webhooks).
- `src/app/not-found.tsx` and `src/app/error.tsx`: base error surfaces.

## Feature structure

Each feature owns its components, data access, validation, and configuration:

- `components/`: feature UI only.
- `sections/`: large page sections composed from components.
- `queries/`: server-side reads.
- `actions/`: Server Action mutations with Zod validation.
- `schemas/`: Zod schemas.
- `store/`: client state for the feature (for example cart).
- `payments/`, `lib/`, `config/`: feature-specific helpers and constants.

Phase 4 filled the `home`, `scroll-hero`, `banners`, `site-content`, `products`, and `categories` feature folders. Remaining empty folders are reserved for later phases.

## Shared layers

- `src/components/ui/`: `Button`, `Input`, `LinkButton`, `Container`, `Section`, `Heading`, `Badge`, `Skeleton`, and `button-styles.ts`.
- `src/components/layout/`: `Header`, `Footer`, `Logo`, `DesktopNav`, `MobileNav`, `CartIndicator`, and `nav-items.ts`.
- `src/lib/constants.ts`: site metadata, route constants, navigation labels, cache tags, storage buckets, blur placeholder.
- `src/lib/env.ts`: Zod-validated environment access via `getEnv()`, `getPublicEnv()`, and `getSiteUrl()`.
- `src/lib/format/`: asset URL resolution, safe external href validation, and EGP formatting.
- `src/hooks/use-prefers-reduced-motion.ts`: shared `useSyncExternalStore` media-query hook.
- `src/lib/utils/cn.ts`: tiny class-name joiner.
- `src/lib/supabase/client.ts`: browser client using only publishable env values.
- `src/lib/supabase/server.ts`: cookie-based server client for Server Components/Actions plus `createPublicClient()` for unauthenticated tagged reads.
- `src/lib/supabase/proxy-session.ts`: session refresh and admin route check used by `src/proxy.ts`.
- `src/lib/supabase/admin.ts`: server-only client using `SUPABASE_SECRET_KEY`.
- `src/lib/supabase/types.ts`: generated public-schema types; do not edit by hand.

## Import rules

- Use aliases: `@/features/*`, `@/components/*`, `@/lib/*`, plus the generated `@/*`.
- Shared UI must not import feature code.
- Layout components may import shared UI and `lib/constants`, but not feature queries/actions.
- Pages may import one feature data helper and feature renderers; all Supabase access stays in `features/*/queries`.
- Client components must not import server-only secrets or `@/lib/env` fields containing secret keys.

## Styling

- Tailwind CSS v4 CSS-first tokens live only in `src/app/globals.css`.
- Components reference semantic tokens such as `bg-black-950`, `bg-surface-900`, `text-accent`, `rounded-card`, and `max-w-container-store`.
- No CSS modules, styled-components, or inline `style={{}}`. Arbitrary Tailwind values are used only for effects Tailwind tokens cannot express (for example `duration-[var(--duration-normal)]`).
- Focus-visible styling and reduced-motion behavior are global base-layer rules.

## Authentication and authorization

- `features/auth/lib/claims.ts` verifies identity with `getClaims()` and returns a narrow DTO.
- `features/auth/lib/require-user.ts` guards customer account pages; `require-admin.ts` guards every admin layout and page.
- `src/proxy.ts` refreshes the session on every non-static request and performs the optimistic `/admin` redirect. It never runs database checks.
- All session-reading components sit behind `<Suspense>` because Cache Components is enabled.
- The three admin layers are independent: proxy redirect, `requireAdmin()`, and the Phase 2 RLS policies.

## Phase 4 data and animation flow

- `features/home/queries/get-home-page-data.ts` is the single page data helper. It composes cached reads from `home`, `banners`, `categories`, `products`, and `site-content`.
- `src/app/(store)/page.tsx` only calls that helper, emits JSON-LD, and maps `home_sections` to `HomeSectionRenderer`.
- `HomeSectionRenderer` maps each section kind to one file under `features/home/sections/`. Banner variants map to `FullWidthPromo`, `SplitBanner`, or `CategoryStrip`.
- `ScrollHeroLoader` dynamically imports the heavy `ScrollHero` client component. `ScrollHero` owns the reduced-motion branch and mounts `SmoothScrollProvider`, `HeroStage`, and `HeroCopy`.
- `useHeroTimeline` is the only module that imports GSAP/ScrollTrigger, using dynamic `import()` so those bytes are not in the initial non-animated bundle. `SmoothScrollProvider` dynamically imports Lenis and uses the same GSAP ticker.
- Parallax banners lazy-load GSAP/ScrollTrigger only after an `IntersectionObserver` reports the banner near the viewport.

## Security and data boundaries

- Supabase clients live in `src/lib/supabase/*`; feature reads and mutations live in `features/*/queries` and `features/*/actions`.
- All tables have RLS enabled. Public reads are limited to published/active content; writes are admin-only.
- Admin role lives in `app_metadata` and is checked by SQL policies, the proxy, and `requireAdmin()`. Future admin Server Actions must call `requireAdmin()` before mutating.
- `SUPABASE_SECRET_KEY` stays server-only. Public URL and publishable key use `NEXT_PUBLIC_` names.

## Verification

Repository verification commands:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

`pnpm check` runs lint, typecheck, and format check together.

Database commands:

```bash
pnpm db:start
pnpm db:reset
pnpm db:types
pnpm admin:bootstrap <email>
```

`pnpm db:*` requires a container runtime. See `docs/DECISIONS.md` for the temporary embedded-Postgres verification used in this environment.

## Phase 5 additions

### Routes

- `src/app/(store)/checkout/page.tsx`: composition-only checkout page with a Suspense boundary around the authenticated form container. Metadata is `noindex`.
- `src/app/(store)/orders/[id]/page.tsx`: awaits async `params`, streams `OrderDetail` inside Suspense, and is `noindex`. `orders/loading.tsx` supplies the route-level fallback.
- `src/app/api/payments/paymob/route.ts`: POST-only webhook skeleton. It verifies the HMAC signature before parsing/validating JSON and returns 401/400 on failure; reconciliation is a TODO.

### Features

- `features/checkout/config/`: governorate choices, copy, shipping JSON keys, payment option display config, and payment copy.
- `features/checkout/schemas/checkout.ts`: Zod validation for shipping fields, cart JSON, and payment provider.
- `features/checkout/lib/`: checkout state/field errors, form-data helpers, piaster-based pricing, and the narrow RPC contract.
- `features/checkout/actions/`: `placeOrder` mutation and a checkout-only cart summary action; both re-read current catalog data on the server.
- `features/checkout/payments/`: provider interface, COD implementation, PayMob stub with env-only config, registry, and Web Crypto signature verification.
- `features/orders/queries/`: cookie-client reads for the current customer's order list and one order with its line items; both validate rows with Zod.
- `features/orders/schemas/`, `types.ts`, `config/`, `lib/`: typed order shapes, status labels, copy, and date formatting.
- `features/orders/components/`: real order list, status badge, detail sections, and skeletons. `MyOrders` no longer shows a placeholder.
- `features/checkout/hooks/use-checkout-cart.ts` is the single adapter to the cart store; it also uses `useCartHydrated()` so the empty-cart state is not shown before localStorage restores. Changing cart-store export names should be handled there.

### Security and data flow

- Checkout validates the user with `requireUser()` and writes through the server-only `createAdminClient()` RPC. The RPC accepts product IDs and quantities only; all prices, names, SKUs, and specs come from `public.products`.
- `place_order` is `security definer`, uses `search_path = ''`, locks product rows `FOR UPDATE`, and is executable only by `service_role`.
- Customer order reads stay on the cookie-based Supabase client, so the existing owner-or-admin RLS policies apply.
- `revalidateTag(CACHE_TAGS.products, "max")` refreshes catalog caches after a purchase; `updateTag(CACHE_TAGS.orders)` gives immediate order visibility.
- `SUPABASE_SECRET_KEY` and PayMob secrets are read only in server code; no secret or hardcoded API key reaches a Client Component.

## Phase 6 additions

### Routes

- `src/app/admin/layout.tsx` remains `noindex, nofollow` and wraps the verified-admin guard, responsive shell, and routed screens in Suspense.
- Admin screens live under `overview`, `banners`, `content`, `products`, `categories`, `orders`, and `settings`, with route-level `loading.tsx` and `error.tsx` files where data is read.
- Printable order invoices are separate admin routes and also inherit the noindex admin layout.

### Features

- `features/admin/config/`: route map, navigation config, and shared display copy.
- `features/admin/lib/`: typed action results, public cache invalidation helpers, `FormData` coercion, and Storage validation/upload/cleanup helpers.
- `features/admin/components/`: generic `DataTable`, `FormField`, `ImageUploader`, `ConfirmDialog`, `SortableList`, pagination, panels, headers, action buttons, and toasts. Each piece is its own file.
- `features/admin/layout/`: sidebar, topbar, and active navigation links. The shell is the only client wrapper around the admin chrome.
- Feature admin screens keep their queries, schemas, actions, and admin-specific components inside the owning feature folder.

### Security and data flow

- Every admin mutation calls `requireAdmin()` before reading any client input, validates with Zod, writes through the server-only `createAdminClient()`, invalidates the matching public cache tags, and returns a typed result.
- Admin reads use the admin client after the layout/page guard so drafts and unpublished rows are visible to editors. Public cached queries continue to use the anon/public client and RLS.
- Uploads happen in a dedicated guarded Server Action; parent forms store only bucket-relative paths. Replace/delete flows remove stale Storage objects after the database write succeeds.
- Admin routes are never publicly cached: session readers stay behind Suspense, and `noindex` metadata is inherited from the admin layout.
