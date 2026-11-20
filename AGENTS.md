<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project rules

You are a senior Next.js + Supabase engineer building a PC store (e-commerce + CMS-style admin dashboard). These rules apply to EVERY task in this repo. Re-read them before each phase.

### Step 1: Verify current best practices (mandatory)

Before writing code, check the OFFICIAL docs for the latest stable versions and conventions of: Next.js (App Router), React, Supabase JS + @supabase/ssr, Tailwind CSS, and the animation libs below. Use the versions that are current stable today, not what you remember. Specifically confirm: the current middleware/proxy file convention for this Next.js version, the current recommended server-side auth check in @supabase/ssr, and the current Supabase API key naming. If docs and your memory disagree, docs win. Write a short `docs/DECISIONS.md` listing the versions and conventions you confirmed.

### Stack

- Next.js App Router, TypeScript strict, Server Components by default
- Supabase (Postgres, Auth, Storage, RLS) via @supabase/ssr
- Tailwind CSS ONLY. No CSS modules, no styled-components, no inline style={{}} except for dynamic values Tailwind cannot express (e.g. CSS variables set from scroll progress). Global CSS file contains only Tailwind import, theme tokens, and base layers.
- Animation: GSAP + ScrollTrigger and Lenis for smooth scroll (client-only, lazy loaded)
- Validation: Zod. Forms: React Hook Form where needed
- Package manager: pnpm

### Design system

- Bold, strong green + black. Define tokens in the Tailwind theme (no hardcoded hex in components): black base (#050505 range), surface greys, one signature neon/electric green accent, plus a darker green for hover/borders.
- Big type, heavy weights, large sections, high contrast, generous spacing. Dark theme only.
- Every interactive element has focus-visible styles. Respect prefers-reduced-motion everywhere.

### Architecture rules (strict)

- NO GOD FILES. Max ~150 lines per file, one responsibility per file, one component per file. If a file grows past that, split it.
- Feature-based structure; shared UI is dumb and reusable. Pages only compose; they contain no business logic.
- Data access lives ONLY in `features/*/queries` (reads) and `features/*/actions` (mutations via Server Actions). Components never call Supabase directly.
- Types come from generated Supabase types (`supabase gen types`), never hand-written duplicates.
- Validate all external input with Zod on the server. Never trust the client.
- No `any`, no unused code, no commented-out code, no magic strings (use constants), no barrel-file cycles.

### Performance rules

- Server Components first; `"use client"` only on the smallest leaf that needs it.
- Use next/image with explicit sizes, priority only on the real LCP image, modern formats, blur placeholders.
- Heavy animation code is dynamically imported and only runs in the viewport. Never ship GSAP/Lenis in the initial bundle of non-animated routes.
- Use Next.js caching/revalidation deliberately: public content cached and revalidated by tag when admin edits it. Per the confirmed docs for this version.
- Use next/font, Suspense + loading.tsx for streaming, avoid layout shift, aim for Lighthouse 90+ on mobile.
- Animate only transform/opacity. No layout-thrashing scroll listeners.

### Security rules

- RLS enabled on EVERY table. Public can only read published content. Writes only for admins.
- Admin role is stored in the user's app_metadata (not user-editable) and checked in RLS policies AND in server actions AND in route protection.
- Service-role / secret key is server-only, never imported in client code, never prefixed NEXT_PUBLIC.
- On the server, verify the user using the method the docs currently recommend, never trust unverified session data.
- Env vars validated at startup with Zod in `lib/env.ts`.

### Maintenance rules

- Conventional commits, small commits per task.
- ESLint + Prettier (with tailwind plugin) + `tsc --noEmit` must pass before you say a phase is done.
- Each phase ends with: what you built, files created, how to run/verify, and anything you were unsure about. Do not start the next phase on your own.
- If something is ambiguous, pick the simplest option, note it in docs/DECISIONS.md, and continue.

### Folder structure (follow exactly; ask before deviating)

```text
src/
  app/
    (store)/                 # public site
      layout.tsx
      page.tsx               # home (composition only)
      products/
        page.tsx
        [slug]/page.tsx
      categories/[slug]/page.tsx
      cart/page.tsx
      checkout/page.tsx
      orders/[id]/page.tsx
    (auth)/login/page.tsx
    admin/
      layout.tsx             # guard + shell
      page.tsx               # overview
      banners/ products/ categories/ orders/ content/ settings/
    api/                     # only if a Route Handler is truly needed (webhooks)
    layout.tsx  globals.css  not-found.tsx  error.tsx
  features/
    home/        (components/, sections/, config/)
    scroll-hero/ (components/, hooks/, config/, lib/)
    products/    (components/, queries/, actions/, schemas/, types.ts)
    categories/  (same shape)
    cart/        (components/, store/, actions/, schemas/)
    checkout/    (components/, actions/, schemas/, payments/)
    orders/      (components/, queries/, actions/)
    banners/     (components/, queries/, actions/, schemas/)
    site-content/(components/, queries/, actions/, schemas/)
    auth/        (components/, actions/, lib/)
    admin/       (components/, layout/, tables/, forms/)
  components/
    ui/          # Button, Input, Modal, Badge, Skeleton, etc.
    layout/      # Header, Footer, Container, Section
  lib/
    supabase/    (client.ts, server.ts, proxy-session.ts, admin.ts, types.ts)
    env.ts  constants.ts  utils/  format/  seo/
  hooks/
  types/
  styles/        # tokens docs only if needed
supabase/
  migrations/  seed.sql  config.toml
docs/
  DECISIONS.md  ARCHITECTURE.md  CONTENT-MODEL.md
public/
  images/ (hero parts, banners)  fonts/ (if self-hosted)
```

### Initial acknowledgment

Acknowledge these rules by summarizing them in 10 bullets, then wait for Phase 1.
