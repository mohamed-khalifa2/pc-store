# PC//STORE

Next.js 16 + Supabase foundation for a PC parts store and admin dashboard.

## Phase 1

- pnpm + TypeScript strict + App Router + `src/`
- Tailwind CSS v4 design tokens
- Shared UI and layout primitives
- Placeholder public store home page
- Zod environment validation
- ESLint, Prettier, and typecheck gates

## Phase 2

- Supabase CLI config plus one-concern timestamped migrations
- RLS on every table with admin role in Auth `app_metadata`
- Storage buckets and admin-only write policies
- Generated database types and seed data
- Browser, cookie server, proxy session, and server-only admin clients
- Next.js 16 `src/proxy.ts` with session refresh and `/admin` protection
- First-admin bootstrap script

## Phase 3

- Email/password login and signup with Zod-validated Server Actions
- Friendly, field-level auth error messages
- Session refresh in `src/proxy.ts`
- Three-layer admin protection: proxy redirect, `requireAdmin()`, and RLS
- Customer account placeholder at `/orders`

See `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT-MODEL.md`, and `docs/MANUAL-TESTS.md` for conventions, structure, and verification steps.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local Supabase

Requires Docker (or another Supabase-supported container runtime).

```bash
pnpm db:start
pnpm db:reset
pnpm db:types
```

Copy the local URL, publishable key, and secret key from `pnpm supabase status` into `.env.local`. Bootstrap the first admin with:

```bash
pnpm admin:bootstrap admin@example.com
```

To create a new admin instead of promoting an existing user, set `ADMIN_PASSWORD` in the environment first. No credentials are hardcoded.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm format:check
```

`pnpm check` runs lint, typecheck, and format check together.

The home page is composed in `src/app/(store)/page.tsx` and wrapped by the public shell in `src/app/(store)/layout.tsx`.
