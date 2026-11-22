# Comprehensive Project Cleanup Audit Report

**Date**: 2026-11-22  
**Branch**: `chore/cleanup-and-ui`  
**Baseline Health Check**: `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build` all pass with exit code `0`.  
**Analysis Tools Used**: `knip` (`6.47.0`), `depcheck` (`1.4.7`), `ts-prune`, `ripgrep` / `git grep`, Node.js AST/search scripts.

---

## 1. Project Map

### Folders & Architecture

- `src/app/`: Next.js 16 App Router routes (composition only, Server Components by default).
- `src/features/`: Feature-sliced modules (`admin`, `auth`, `banners`, `cart`, `categories`, `checkout`, `home`, `orders`, `products`, `scroll-hero`, `site-content`).
- `src/components/`: Reusable shared dumb UI (`components/ui/`) and global layout (`components/layout/`).
- `src/lib/`: Core utilities, Supabase client factories (`server.ts`, `client.ts`, `admin.ts`, `proxy-session.ts`), environment validation (`env.ts`), constants (`constants.ts`), formatters, and types.
- `src/hooks/`: Global cross-feature React hooks (`use-prefers-reduced-motion.ts`, `use-webgl-support.ts`).
- `public/`: Static public assets (`images/`, `models/`, fonts).
- `scripts/`: Dev & bootstrap scripts (`create-first-admin.mjs`, `optimize-hero-models.mjs`).
- `supabase/`: Migrations (`supabase/migrations/*.sql`), `seed.sql`, and `config.toml`.
- `docs/`: Architecture records, technical decisions, and content models.

### Route Inventory (`src/app/`)

| Route                      | Type                               | Description                                                        |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| `/`                        | Static (Revalidate: 1h)            | Storefront home page composing hero, banners, categories, products |
| `/login`                   | Partial Prerender                  | Customer/Admin authentication login                                |
| `/signup`                  | Static                             | Customer registration                                              |
| `/products`                | Partial Prerender (Revalidate: 1h) | Catalog listing with search, category, stock, and price filters    |
| `/products/[slug]`         | Partial Prerender (Revalidate: 1h) | Product detail view, specs, gallery, and related items             |
| `/categories`              | Static (Revalidate: 1h)            | Category taxonomy directory                                        |
| `/categories/[slug]`       | Partial Prerender (Revalidate: 1h) | Category product catalog                                           |
| `/cart`                    | Static (Revalidate: 1h)            | Shopping cart review and drawer state                              |
| `/checkout`                | Partial Prerender                  | Checkout form, shipping address, payment selection                 |
| `/orders`                  | Partial Prerender (Revalidate: 1h) | Authenticated user order history                                   |
| `/orders/[id]`             | Partial Prerender (Revalidate: 1h) | Order confirmation and tracking                                    |
| `/admin`                   | Partial Prerender (Guarded)        | Control room dashboard & metrics overview                          |
| `/admin/banners`           | Partial Prerender (Guarded)        | Banner campaign management table                                   |
| `/admin/banners/new`       | Partial Prerender (Guarded)        | Banner creation form                                               |
| `/admin/banners/[id]`      | Partial Prerender (Guarded)        | Banner editor form                                                 |
| `/admin/categories`        | Partial Prerender (Guarded)        | Category taxonomy table                                            |
| `/admin/categories/new`    | Partial Prerender (Guarded)        | Category creation form                                             |
| `/admin/categories/[id]`   | Partial Prerender (Guarded)        | Category editor form                                               |
| `/admin/content`           | Partial Prerender (Guarded)        | Site settings, hero copy, scroll step copy editor                  |
| `/admin/orders`            | Partial Prerender (Guarded)        | Store orders overview and status filters                           |
| `/admin/orders/[id]`       | Partial Prerender (Guarded)        | Order detail view & status management                              |
| `/admin/orders/[id]/print` | Partial Prerender (Guarded)        | Printable order invoice                                            |
| `/admin/products`          | Partial Prerender (Guarded)        | Product catalog table and filter controls                          |
| `/admin/products/new`      | Partial Prerender (Guarded)        | Product creation form                                              |
| `/admin/products/[id]`     | Partial Prerender (Guarded)        | Product editor form                                                |
| `/admin/settings`          | Partial Prerender (Guarded)        | Store environment & integration configuration overview             |
| `/api/payments/paymob`     | Dynamic Route Handler              | PayMob webhook endpoint (HMAC-SHA256 signature verification)       |

---

## 2. SAFE TO DELETE

The following items have zero references across the entire codebase (no imports, no dynamic imports, no JSX usage, no string path occurrences, no SQL/seed references, no Tailwind usages).

### 2.1 Unused Files (4 files)

| Path                                              | Why Unused                                                                                                                                                                                                                                 | Evidence                                                                                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/admin/components/AdminOverview.tsx` | Legacy placeholder overview component from early Phase 1. The real `/admin` page uses `OverviewStats` and `RecentOrdersTable` with `getAdminOverview()`.                                                                                   | `git grep AdminOverview` returns only its own declaration in `AdminOverview.tsx`. Knip reports as unused file. Zero JSX references.      |
| `src/features/categories/queries/index.ts`        | Barrel re-export file. All modules import query functions directly from specific files (e.g. `@/features/categories/queries/get-categories`). [AGENTS.md](file:///c:/projects/pc-store/AGENTS.md) explicitly prohibits barrel-file cycles. | `git grep 'from "@/features/categories/queries"'` returns zero references. Knip reports unused file.                                     |
| `src/features/products/queries/index.ts`          | Barrel re-export file. All callers import directly from individual query files (e.g. `@/features/products/queries/get-products`).                                                                                                          | `git grep 'from "@/features/products/queries"'` returns zero references. Knip reports unused file.                                       |
| `src/features/home/config/highlights.ts`          | Phase 1 static constants (`HOME_BADGE_LABEL`, `HOME_HIGHLIGHTS`). Home page sections now derive dynamically from `home_sections` database table and `site_content`.                                                                        | `git grep "HOME_HIGHLIGHTS"` and `git grep "HOME_BADGE_LABEL"` return zero references outside `highlights.ts`. Knip reports unused file. |

### 2.2 Unused Public Template Assets (5 files)

| Path                | Why Unused                                          | Evidence                                                               |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------------------------- |
| `public/file.svg`   | Default Next.js starter template boilerplate asset. | Zero references in `src/`, `public/`, `supabase/`, `scripts/`, or CSS. |
| `public/globe.svg`  | Default Next.js starter template boilerplate asset. | Zero references across the entire repository.                          |
| `public/next.svg`   | Default Next.js starter template boilerplate asset. | Zero references across the entire repository.                          |
| `public/vercel.svg` | Default Next.js starter template boilerplate asset. | Zero references across the entire repository.                          |
| `public/window.svg` | Default Next.js starter template boilerplate asset. | Zero references across the entire repository.                          |

### 2.3 Unused Functions / Dead Code Exports (4 functions)

| Location                                     | Export / Function                      | Why Unused & Evidence                                                                                                                                                                                                        |
| -------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/admin/lib/form-data.ts:18`     | `formFiles(formData, key)`             | Helper to extract non-empty `File` arrays from FormData. Admin image uploads use direct upload actions via `ImageUploader` instead. `git grep formFiles` returns 0 external callers.                                         |
| `src/features/admin/lib/form-data.ts:24`     | `formIndexedStrings(formData, prefix)` | Helper to extract indexed form fields (`prefix0`, `prefix1`). Specs and images use JSON serialization or dedicated endpoints instead. `git grep formIndexedStrings` returns 0 external callers.                              |
| `src/features/auth/lib/auth-state.ts:19`     | `authErrorState(message, fieldErrors)` | Factory function to build an error `AuthState`. Auth actions (`login.ts`, `signup.ts`) construct literal `{ status: "error", message, fieldErrors }` objects directly. `git grep authErrorState` returns 0 external callers. |
| `src/features/checkout/payments/index.ts:12` | `getAvailablePaymentProviders()`       | Filter function to get active payment providers. Checkout renders payment options statically or queries `getPaymentProvider(id)` directly. `git grep getAvailablePaymentProviders` returns 0 callers.                        |

### 2.4 Unused `export` Modifiers (Internal-Only Symbols) (11 symbols)

_These symbols are actively used within their declaring file, but the `export` keyword is unreferenced by any other file:_

| File                                              | Symbol                   | Internal Usage                                                    | Evidence                                                                      |
| ------------------------------------------------- | ------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `src/components/ui/button-styles.ts:3`            | `BUTTON_VARIANTS`        | Used by `ButtonVariant` type and `buttonClassName()`.             | `git grep BUTTON_VARIANTS` has 0 imports outside `button-styles.ts`.          |
| `src/components/ui/button-styles.ts:10`           | `BUTTON_SIZES`           | Used by `ButtonSize` type and `buttonClassName()`.                | `git grep BUTTON_SIZES` has 0 imports outside `button-styles.ts`.             |
| `src/features/admin/lib/revalidate-public.ts:13`  | `refreshAdminTag`        | Called internally by `refreshAndRevalidate()`.                    | `git grep refreshAdminTag` has 0 imports outside `revalidate-public.ts`.      |
| `src/features/admin/lib/storage.ts:26`            | `storagePath`            | Called internally by `uploadImage()`.                             | `git grep storagePath` has 0 function imports outside `storage.ts`.           |
| `src/features/auth/lib/form-errors.ts:14`         | `fieldErrorsFrom`        | Called internally by `validationState()`.                         | `git grep fieldErrorsFrom` has 0 imports outside `form-errors.ts`.            |
| `src/features/cart/schemas/cart-details.ts:3`     | `cartDetailLineSchema`   | Used internally by `cartDetailLinesSchema` and `CartDetailLine`.  | `git grep cartDetailLineSchema` has 0 imports outside `cart-details.ts`.      |
| `src/features/checkout/lib/place-order-rpc.ts:8`  | `PLACE_ORDER_RPC`        | Used internally by `PlaceOrderRpcClient` type and RPC dispatch.   | `git grep PLACE_ORDER_RPC` has 0 imports outside `place-order-rpc.ts`.        |
| `src/features/checkout/lib/place-order-rpc.ts:18` | `placeOrderResultSchema` | Used internally to parse RPC return value in `callPlaceOrderRpc`. | `git grep placeOrderResultSchema` has 0 imports outside `place-order-rpc.ts`. |
| `src/features/checkout/payments/paymob.ts:12`     | `readPaymobConfig`       | Called internally inside `paymobProvider.pay`.                    | `git grep readPaymobConfig` has 0 imports outside `paymob.ts`.                |
| `src/features/checkout/schemas/checkout.ts:9`     | `checkoutShippingSchema` | Extended internally by `checkoutFormSchema`.                      | `git grep checkoutShippingSchema` has 0 imports outside `checkout.ts`.        |
| `src/features/home/schemas/home-section.ts:13`    | `homeSectionBodySchema`  | Used internally in `homeSectionRowSchema`.                        | `git grep homeSectionBodySchema` has 0 imports outside `home-section.ts`.     |
| `src/features/orders/schemas/order.ts:12`         | `shippingAddressSchema`  | Used internally in `addressFromJson`.                             | `git grep shippingAddressSchema` has 0 imports outside `order.ts`.            |
| `src/features/products/lib/filter-url.ts:11`      | `filtersToSearchParams`  | Called internally by `productsHref()`.                            | `git grep filtersToSearchParams` has 0 imports outside `filter-url.ts`.       |
| `src/features/products/lib/filter-url.ts:25`      | `productsHref`           | Called internally by `pageHref()` and `resetFiltersHref()`.       | `git grep productsHref` has 0 imports outside `filter-url.ts`.                |

### 2.5 Unused Exported TypeScript Types (12 types)

| Location                                                | Type                                   | Why Unused & Evidence                                                                                                                          |
| ------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/auth/lib/schemas.ts:21`                   | `LoginInput`                           | Inferred Zod input type; actions consume `loginSchema.safeParse` output directly. 0 external references.                                       |
| `src/features/auth/lib/schemas.ts:22`                   | `SignupInput`                          | Inferred Zod input type; 0 external references.                                                                                                |
| `src/features/banners/config/placements.ts:8`           | `BannerPlacement`                      | Inferred placement type; banner queries and schemas use string unions directly. 0 external references.                                         |
| `src/features/categories/schemas/category-detail.ts:17` | `CategoryDetailRow`                    | Category detail queries return typed domain models. 0 external references.                                                                     |
| `src/features/checkout/config/governorates.ts:31`       | `EgyptGovernorate`                     | Governorate string literal union; form schema validates via `z.enum(EGYPT_GOVERNORATES)`. 0 external references.                               |
| `src/features/checkout/config/shipping-keys.ts:10`      | `ShippingAddressSnapshot`              | Order addresses use `ShippingAddress` from `orders/schemas/order.ts`. 0 external references.                                                   |
| `src/features/checkout/payments/types.ts:3`             | `PaymentContext`                       | Stub context type for payment redirection; COD does not use context. 0 external references.                                                    |
| `src/features/checkout/payments/types.ts:10`            | `PaymentResult`                        | Return type union for payment providers; 0 external references.                                                                                |
| `src/features/checkout/schemas/checkout.ts:26`          | `CheckoutShippingValues`               | Form uses `CheckoutFormValues`. 0 external references.                                                                                         |
| `src/features/checkout/schemas/checkout.ts:28`          | `PaymentProviderId`                    | Redundant type alias in checkout schema (`PaymentProviderId` is imported from `lib/constants.ts` by payment providers). 0 external references. |
| `src/features/products/schemas/listing.ts:17, 18`       | `ListedProductRow`, `DetailProductRow` | Inferred row types from listing schema; queries return `ProductListingItem` / `ProductDetailData`. 0 external references.                      |
| `src/features/products/types.ts:13`                     | `ProductCategoryRef`                   | Ref type superseded by category models. 0 external references.                                                                                 |
| `src/features/scroll-hero/config/parts.ts:1`            | `HeroTransform`                        | Parts configuration object is inferred with `as const`. 0 external references.                                                                 |
| `src/features/scroll-hero/lib/hero-runtime.ts:1`        | `HeroRuntimeListener`                  | Listener callback type; listener set uses inline signature. 0 external references.                                                             |
| `src/features/site-content/types.ts:7`                  | `SiteContentEntry`                     | Unused type. Admin screens use `AdminSiteContentEntry` from `types.admin.ts`. 0 external references.                                           |

---

## 3. NEEDS CONFIRMATION

The following items appear unused by static analysis tools, but may serve architectural, future, or indirect purposes:

1. **`src/lib/supabase/client.ts`**:
   - _Status_: Flagged by Knip as an unused file.
   - _Context_: Implements `createClient()` using `@supabase/ssr` `createBrowserClient<Database>`.
   - _Why it's unused now_: All current queries, mutations, and session reads execute server-side via Server Components, Server Actions (`server.ts`), and proxy (`proxy-session.ts`).
   - _Indirect value_: [AGENTS.md](file:///c:/projects/pc-store/AGENTS.md) explicitly lists `lib/supabase/(client.ts, server.ts, proxy-session.ts, admin.ts, types.ts)` in the required folder structure. If browser subscriptions (e.g. Supabase Realtime for order tracking) are added, this is the standard client.
   - _Recommendation_: **KEEP** or confirm removal.
2. **`react-hook-form` in `package.json:32`**:
   - _Status_: Flagged by Knip and Depcheck as an unused dependency.
   - _Context_: Installed during Phase 1 (`react-hook-form 7.92.0`).
   - _Why it's unused now_: In Phases 3, 5, and 6, forms were built with native React 19 `useActionState` and Server Actions directly with Zod validation.
   - _Indirect value_: [AGENTS.md](file:///c:/projects/pc-store/AGENTS.md) states: _"Validation: Zod. Forms: React Hook Form where needed"_.
   - _Recommendation_: Confirm whether to uninstall `react-hook-form` to trim `node_modules` or keep for complex client-side forms.
3. **Redundant `.gitkeep` files in populated directories**:
   - _Status_: 50+ `.gitkeep` files exist in directories that now contain `.ts` / `.tsx` files (e.g. `src/features/auth/actions/.gitkeep`).
   - _Recommendation_: Keep or safely prune only from populated directories while preserving empty directories.

---

## 4. MUST KEEP Despite Looking Unused

The following files and exports triggered alerts in Knip, Depcheck, or ts-prune, but MUST NOT be modified or removed:

1. **Next.js App Router Special Files & Framework Conventions**:
   - `default` exports in all `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
   - `generateStaticParams` in `src/app/(store)/categories/[slug]/page.tsx` and `src/app/(store)/products/[slug]/page.tsx`.
   - `metadata` exports across routes.
   - `POST` export in `src/app/api/payments/paymob/route.ts` (Next.js Route Handler HTTP method export).
   - `src/proxy.ts`: Next.js 16 proxy convention for session refresh and admin route protection.
2. **Dev Tooling & Pipeline Dependencies**:
   - `@gltf-transform/cli`: Flagged as unused by Knip/Depcheck. **MUST KEEP**: Invoked directly by `scripts/optimize-hero-models.mjs` via Node CLI child process to compress 3D models with Meshopt and WebP textures (`pnpm models:optimize`).
   - `typescript-eslint`: Flagged as unused by Knip/Depcheck. **MUST KEEP**: Provides TypeScript ESLint parser and rules referenced in `eslint.config.mjs`.
   - `@tailwindcss/turbopack`: Flagged by Depcheck. **MUST KEEP**: Turbopack Tailwind CSS v4 loader in `next.config.ts`.
   - `prettier-plugin-tailwindcss`: Flagged by Depcheck. **MUST KEEP**: Prettier formatting plugin.
   - `tailwindcss`: Flagged by Depcheck. **MUST KEEP**: Core Tailwind CSS v4 framework.
   - `@types/node`, `@types/react`, `@types/react-dom`, `@types/three`: TypeScript compiler types.
   - `typescript` / `typescript7`: Dual-version TypeScript aliasing required for TypeScript 7 CLI and typescript-eslint compatibility (documented in `docs/DECISIONS.md`).
3. **Source 3D Models in `public/images/hero/parts/*.glb`**:
   - `case.glb`, `cpu.glb`, `gpu.glb`, `motherboard.glb`, `ram.glb`, `ssd.glb`.
   - **MUST KEEP**: These are the original, uncompressed source assets ingested by `scripts/optimize-hero-models.mjs` to generate the production models in `public/models/*.glb`.
4. **Hero Static Fallback SVG Parts in `public/images/hero/parts/*.svg`**:
   - `fans.svg`, `frame.svg`, `front-panel.svg`, `gpu.svg`, `motherboard.svg`, `psu.svg`, `ram.svg`, `side-panel.svg`.
   - **MUST KEEP**: Required by `HeroStatic.tsx` as fallback for SSR, loading, devices without WebGL, and `prefers-reduced-motion`.
5. **Database Schemas & Generated Types (Rule 3)**:
   - `supabase/migrations/**`, `supabase/seed.sql`, `supabase/config.toml`: Strictly untouchable.
   - `src/lib/supabase/types.ts`: Generated types (`Constants`, `Tables`, `TablesInsert`, `TablesUpdate`, `Enums`, `CompositeTypes`). Untouchable per safety rules.
6. **Mandatory Empty Directory `.gitkeep` Files**:
   - `public/fonts/.gitkeep`, `src/styles/.gitkeep`, `src/types/.gitkeep`, `src/lib/seo/.gitkeep`, `src/features/admin/forms/.gitkeep`, `src/features/admin/tables/.gitkeep`, `src/features/admin/layout/.gitkeep`.
   - **MUST KEEP**: Preserves required folder structure in git.

---

## 5. Duplicates and Near-Duplicates

### 5.1 Form Input Field Wrappers (Direct Duplication)

- **Files**:
  - `src/features/auth/components/AuthField.tsx` (40 lines)
  - `src/features/checkout/components/CheckoutField.tsx` (54 lines)
- **Issue**: Both components render an identical pattern: a container `<div className="space-y-2">`, an uppercase tracking-widest `<label>`, a shared `<Input>` component, and an error `<p className="text-danger text-xs font-semibold">`.
- **Admin counterpart**: `src/features/admin/components/FormField.tsx` renders the same layout accepting `children`.
- **Refactoring Opportunity**: A single unified `FormField` component in `src/components/ui/FormField.tsx` can power auth, checkout, and admin forms.

### 5.2 Submit Buttons with `useFormStatus` (Triplicate Pattern)

- **Files**:
  - `src/features/admin/components/AdminSubmitButton.tsx` (38 lines)
  - `src/features/auth/components/SubmitButton.tsx` (21 lines)
  - `src/features/checkout/components/CheckoutSubmit.tsx` (23 lines)
- **Issue**: All three components hook into React 19's `useFormStatus()`, disable the button while `pending`, apply `aria-busy={pending}`, and switch between `pendingLabel` and standard label.
- **Refactoring Opportunity**: Consolidate into a single reusable `src/components/ui/SubmitButton.tsx`.

### 5.3 `fieldValue` Helper (Identical Copy-Paste Triplicate)

- **Files**:
  - `src/features/site-content/components/admin/HeroCopyForm.tsx` (lines 21-25)
  - `src/features/site-content/components/admin/ScrollStepsForm.tsx` (lines 37-41)
  - `src/features/site-content/components/admin/SiteSettingsForm.tsx` (lines 37-41)
- **Code**:
  ```ts
  function fieldValue(entries: readonly AdminSiteContentEntry[], key: SiteContentKey): string {
    const entry = entries.find((item) => item.key === key);
    const value = entry?.value ?? DEFAULT_SITE_CONTENT[key];
    return typeof value === "string" ? value : String(value);
  }
  ```
- **Refactoring Opportunity**: Extract to `src/features/site-content/lib/field-value.ts`.

### 5.4 `formString` Helper (Near-Duplicate)

- **Files**:
  - `src/features/admin/lib/form-data.ts:1`: `formString(formData: FormData, key: string): string`
  - `src/features/auth/lib/form-data.ts:1`: `formString(value: FormDataEntryValue | null): string`
- **Issue**: Identical trimming and type checking logic with differing function signatures.

---

## 6. Dead Code Inside Files

### 6.1 Commented-Out Code

- **Result**: Zero commented-out code blocks found anywhere in `src/`.

### 6.2 Console Calls

- **Result**: Zero `console.log`, `console.warn`, or `console.error` calls anywhere in `src/`. (Only CLI scripts in `scripts/` contain expected terminal logging).

### 6.3 Stale / Pending TODOs

All remaining TODO comments represent documented stubs for future external integration:

1. `src/app/api/payments/paymob/route.ts:41`: `// TODO: reconcile parsed.data.obj.order.id with an order, verify amount`
2. `src/features/checkout/config/payment-copy.ts:4`: `paymobNotImplemented: "TODO: create a PayMob payment session and return its redirect URL."`
3. `src/features/checkout/payments/paymob.ts:30`: `// TODO: enable once pay() returns a real payment URL.`
4. `src/features/checkout/payments/paymob.ts:37`: `// TODO: use config to request an auth token, order id, and payment key.`
5. `src/features/checkout/payments/paymob.ts:38`: `// TODO: return { kind: "redirect", url } from the payment key response.`

---

## 7. Files Over 150 Lines That Should Be Split

_[AGENTS.md](file:///c:/projects/pc-store/AGENTS.md) architectural rule: "NO GOD FILES. Max ~150 lines per file, one responsibility per file, one component per file. If a file grows past that, split it."_

While ESLint currently passes because `max-lines` is configured with `skipBlankLines: true, skipComments: true`, the following files exceed 150 total physical lines and should be refactored into smaller, focused single-responsibility files:

| File                                                     | Total Physical Lines | Code Lines (excl. blanks & comments) | Responsibilities to Split                                                                                                                                                                                                                                                |
| -------------------------------------------------------- | -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/features/products/actions/upsert-product.ts`        | **168**              | 149                                  | Orchestrates FormData extraction, slug generation, category validation, product row upsert, image relation diffing/upsert, and cache revalidation. **Plan**: Extract image upsert / diffing logic into `src/features/products/actions/sync-product-images.ts`.           |
| `src/features/scroll-hero/components/HeroModelStage.tsx` | **166**              | 148                                  | Handles R3F Canvas container, keyboard rotation listeners, pointer drag scrubbers, intersection observers, and visibility state. **Plan**: Extract keyboard/pointer rotation handling into a custom hook `src/features/scroll-hero/hooks/use-hero-stage-interaction.ts`. |
| `src/features/banners/actions/upsert-banner.ts`          | **164**              | 146                                  | Handles FormData extraction, date range parsing and validation, storage upload orchestration, DB upsert, and cache invalidation. **Plan**: Extract date range / FormData validation into `src/features/banners/lib/banner-form-parser.ts`.                               |
| `src/lib/supabase/types.ts`                              | **606**              | 569                                  | Generated Supabase database schema types. **Status**: Explicitly ignored by ESLint and protected by Rule 3; do not manually split or modify.                                                                                                                             |

---

## 8. Summary of Recommendations for Phase B

1. **Delete Safe Unused Files**:
   - `src/features/admin/components/AdminOverview.tsx`
   - `src/features/categories/queries/index.ts`
   - `src/features/products/queries/index.ts`
   - `src/features/home/config/highlights.ts`
   - `public/{file,globe,next,vercel,window}.svg`
2. **Remove Dead Functions & Clean Unused Export Modifiers**:
   - Remove unused functions `formFiles`, `formIndexedStrings`, `authErrorState`, `getAvailablePaymentProviders`.
   - Remove unused `export` keywords from internal-only helpers across `src/features/*/`.
   - Remove unused type exports (`LoginInput`, `SignupInput`, `SiteContentEntry`, etc.).
3. **Resolve Duplicates**:
   - Consolidate `fieldValue` in site-content admin forms to a single shared helper.
   - Unify `AdminSubmitButton`, `SubmitButton`, and `CheckoutSubmit` into a shared `components/ui/SubmitButton.tsx`.
   - Unify `AuthField` and `CheckoutField` into a shared `FormField`.
4. **Split Files Over 150 Lines**:
   - Split `upsert-product.ts` (168 lines) $\rightarrow$ extract image sync.
   - Split `HeroModelStage.tsx` (166 lines) $\rightarrow$ extract interaction hook.
   - Split `upsert-banner.ts` (164 lines) $\rightarrow$ extract form parsing.
5. **Decide on Needs Confirmation Items**:
   - Confirm keeping `src/lib/supabase/client.ts` as architectural standard.
   - Confirm whether to keep or remove `react-hook-form`.
