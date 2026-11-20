# Architecture — Phases 1 and 2

## Principles

- Server Components by default. `"use client"` only on the smallest interactive leaf (currently `MobileNav` and `error.tsx`).
- Pages compose; they do not contain business logic.
- One component per file, one responsibility per file, maximum ~150 code lines per file (lint-enforced).
- Shared UI is dumb and reusable. Feature-specific UI stays under `src/features/<feature>/`.
- Components never call Supabase directly. Reads live in `features/*/queries`; mutations live in `features/*/actions` as Server Actions.
- External input is validated with Zod on the server before use.
- No `any`, unused code, commented-out code, barrel-file cycles, or magic strings. Repeated strings live in `src/lib/constants.ts` or a feature config file.

## Route structure

- `src/app/layout.tsx`: root HTML shell, `next/font`, metadata, global CSS.
- `src/app/(store)/layout.tsx`: public store shell with `Header`, `main`, and `Footer`.
- `src/app/(store)/page.tsx`: placeholder home page composed from shared UI and `features/home/config`.
- `src/app/(auth)/`: login route placeholders.
- `src/app/admin/`: future admin guard and shell.
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

Placeholders in this phase are `.gitkeep` files. They will be replaced by real files in later phases.

## Shared layers

- `src/components/ui/`: `Button`, `LinkButton`, `Container`, `Section`, `Heading`, `Badge`, `Skeleton`, and `button-styles.ts`.
- `src/components/layout/`: `Header`, `Footer`, `Logo`, `DesktopNav`, `MobileNav`, `CartIndicator`, and `nav-items.ts`.
- `src/lib/constants.ts`: site metadata, route constants, navigation labels, placeholders.
- `src/lib/env.ts`: Zod-validated environment access via `getEnv()`, `getPublicEnv()`, and `getSiteUrl()`.
- `src/lib/utils/cn.ts`: tiny class-name joiner.
- `src/lib/supabase/client.ts`: browser client using only publishable env values.
- `src/lib/supabase/server.ts`: cookie-based server client for Server Components/Actions.
- `src/lib/supabase/proxy-session.ts`: session refresh and admin route check used by `src/proxy.ts`.
- `src/lib/supabase/admin.ts`: server-only client using `SUPABASE_SECRET_KEY`.
- `src/lib/supabase/types.ts`: generated public-schema types; do not edit by hand.

## Import rules

- Use aliases: `@/features/*`, `@/components/*`, `@/lib/*`, plus the generated `@/*`.
- Shared UI must not import feature code.
- Layout components may import shared UI and `lib/constants`, but not feature queries/actions.
- Pages may import feature sections/config and shared UI; data fetching will be delegated to `features/*/queries` in later phases.
- Client components must not import server-only secrets or `@/lib/env` fields containing secret keys.

## Styling

- Tailwind CSS v4 CSS-first tokens live only in `src/app/globals.css`.
- Components reference semantic tokens such as `bg-black-950`, `bg-surface-900`, `text-accent`, `rounded-card`, and `max-w-container-store`.
- No CSS modules, styled-components, or inline `style={{}}`. Arbitrary Tailwind values are used only for effects Tailwind tokens cannot express (for example `duration-[var(--duration-normal)]`).
- Focus-visible styling and reduced-motion behavior are global base-layer rules.

## Security and data boundaries

- Supabase clients live in `src/lib/supabase/*`; feature reads and mutations will live in `features/*/queries` and `features/*/actions`.
- All tables have RLS enabled. Public reads are limited to published/active content; writes are admin-only.
- Admin role lives in `app_metadata` and is checked by SQL policies and `src/proxy.ts`. Server Action checks will use the same verified-claims pattern in later phases.
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
