# Content model

The schema is defined by timestamped migrations in `supabase/migrations/`. Every table uses a UUID primary key, `created_at`/`updated_at` timestamps where relevant, and row level security. TypeScript shapes come from `src/lib/supabase/types.ts`, which is generated with `pnpm db:types`; never hand-write duplicate database types.

## Conventions

- **Admin identity** lives in `auth.users.app_metadata.role`. It is never stored in `public.profiles`.
- **Admin checks** use the SQL helper `public.is_admin()` in RLS policies and `getClaims()` in Next.js proxy/server code.
- **Publication** uses `is_published` plus an optional `published_at` timestamp. A row is public only when `is_published = true` and `published_at` is null or in the past.
- **Campaign timing** for banners additionally uses `starts_at` and `ends_at`.
- **Writes** are admin-only on every table. Authenticated non-admins have no effective write path; anon has no write grants at all.
- **Deletes** use cascades for owned child rows and `set null` for optional references that should preserve history.

## Table reference

| Table            | Purpose                                      | Admin screen        | Public visibility                           |
| ---------------- | -------------------------------------------- | ------------------- | ------------------------------------------- |
| `profiles`       | Customer/admin display profile for Auth user | `/admin/settings`   | Private: owner or admin only                |
| `categories`     | Product taxonomy and landing pages           | `/admin/categories` | Published rows                              |
| `products`       | Catalog items, price, stock, specs           | `/admin/products`   | Published rows                              |
| `product_images` | Ordered images attached to products          | `/admin/products`   | Active rows for published products          |
| `banners`        | Home and campaign banners                    | `/admin/banners`    | Active, published, in-window rows           |
| `site_content`   | Small global key/value content               | `/admin/content`    | Published rows                              |
| `home_sections`  | Ordered home-page section configuration      | `/admin/content`    | Published rows                              |
| `orders`         | Purchase headers and address snapshots       | `/admin/orders`     | Private: owner or admin only                |
| `order_items`    | Immutable line items for each order          | `/admin/orders`     | Private: owner of the parent order or admin |
| `addresses`      | Saved customer addresses if checkout needs   | `/admin/settings`   | Private: owner or admin only                |

## Table details

### `profiles`

- `id` references `auth.users(id)` and is populated automatically by the `on_auth_user_created` trigger.
- Optional `full_name`, `phone`, and `avatar_url`.
- SELECT is allowed for the owner or an admin; all writes require `public.is_admin()`.

### `categories`

- `name`, unique `slug`, optional `description`, `image_path`, and `parent_id` for nested categories.
- `sort_order`, `is_published`, `published_at`.
- Indexes: `slug`, `parent_id`, `is_published`, `sort_order`.

### `products`

- Catalog fields: `name`, unique `slug`, `description`, unique `sku`, `category_id`.
- Pricing/inventory: `price_egp numeric(12,2)`, `compare_at_price`, `stock`, `sort_order`.
- Merchandising: `specs jsonb`, `is_featured`, `is_published`, `published_at`.
- `compare_at_price` must be null or greater than or equal to `price_egp`; `stock` cannot be negative.
- Indexes: `slug`, `category_id`, `is_published`, `sort_order`, `is_featured`.

### `product_images`

- `product_id` cascades from `products`; `storage_path` points to the `product-images` bucket.
- `alt_text`, `sort_order`, `is_active`, and a unique `(product_id, storage_path)` pair.
- Public SELECT also requires the parent product to be published.

### `banners`

- `name` is unique; `image_path` points to the `banners` bucket.
- Optional `headline`, `subheadline`, `cta_label`, `cta_href`.
- `sort_order`, `is_active`, `published_at`, `starts_at`, `ends_at`.
- Indexes: `sort_order`, `is_active`, `published_at`.

### `site_content`

- Unique `key`, `value jsonb`, `is_published`, `published_at`.
- Seed keys cover site name/description, contact details, shipping note, home SEO, hero artwork (`home.hero.image`, `home.hero.image_alt`), and bundle definitions (`bundles.definitions`).
- About and Terms & policies copy is intentionally static TypeScript config, not `site_content`; no migration or admin form is needed.
- Admin UI should edit values through keyed forms rather than raw JSON only.

### `home_sections`

- Unique `key`, `kind`, optional `title`/`subtitle`, `body jsonb`, `config jsonb`.
- Current `kind` values: `hero`, `marquee`, `banners`, `featured_categories`, `featured_products`, `bundles`, `build_cta`, `why_us`, `newsletter`, `footer_cta`.
- Legacy `category_grid`, `banner_carousel`, and `rich_text` rows are still accepted and normalized to `featured_categories`, `banners`, and `why_us`.
- `config` supports `limit`, `variants`, `items`, `href`, and `label`. `body` may contain arrays such as trust `points`.
- `sort_order`, `is_published`, `published_at` control public composition.

### `orders`

- `order_number` is unique; `user_id` references Auth users.
- `status` enum-like check: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`.
- `total_egp`, `currency` (default `EGP`), customer contact fields, and `shipping_address`/`billing_address` snapshots.
- Public site never reads orders; SELECT is owner-or-admin only. Writes are admin-only, so checkout Server Actions should use the server-only admin client.

### `order_items`

- `order_id` cascades from `orders`; optional `product_id` becomes null if a product is deleted.
- Snapshots `product_name`, `sku`, `unit_price_egp`, `quantity`, `selected_specs`.
- `line_total_egp` is a stored generated column (`quantity * unit_price_egp`).

### `addresses`

- `user_id`, `label`, `full_name`, `phone`, `line1`, `line2`, `city`, `governorate`, `postal_code`, `country_code`, `is_default`.
- Private owner/admin SELECT and admin-only writes. Checkout persists the chosen address as an order snapshot.

## RLS summary

| Operation | `anon`                               | `authenticated` (non-admin)          | `authenticated` (admin) | `service_role`          |
| --------- | ------------------------------------ | ------------------------------------ | ----------------------- | ----------------------- |
| SELECT    | Published/active catalog and content | Published content + own private rows | All rows                | All rows (bypasses RLS) |
| INSERT    | Rejected by grants                   | Rejected by policies                 | Allowed                 | Allowed                 |
| UPDATE    | Rejected by grants                   | Rejected by policies                 | Allowed                 | Allowed                 |
| DELETE    | Rejected by grants                   | Rejected by policies                 | Allowed                 | Allowed                 |

## Storage buckets

| Bucket           | Public read | Size limit | Allowed MIME types         | Used by              |
| ---------------- | ----------- | ---------- | -------------------------- | -------------------- |
| `product-images` | Yes         | 5 MiB      | WebP, AVIF, JPEG, PNG      | `product_images`     |
| `banners`        | Yes         | 5 MiB      | WebP, AVIF, JPEG, PNG      | `banners`            |
| `site-assets`    | Yes         | 2 MiB      | WebP, AVIF, JPEG, PNG, SVG | Content/admin assets |

Bucket definitions live in `supabase/config.toml` for local development and in `202611200013_create_storage_policies.sql` for reproducible hosted setup. Storage objects are publicly readable and admin-writable only.

## Cache tags

Public queries use these tags through `cacheTag()` inside `use cache` functions. Admin mutations should revalidate the matching tags with `revalidateTag()`.

| Content                     | Tag             |
| --------------------------- | --------------- |
| Products and product images | `products`      |
| Categories                  | `categories`    |
| Banners                     | `banners`       |
| Site content                | `site-content`  |
| Home sections               | `home-sections` |
| Orders                      | `orders`        |

Constants live in `src/lib/constants.ts` as `CACHE_TAGS`. Public reads are in `features/*/queries`; admin mutations should revalidate the corresponding tag. See `docs/PLACEHOLDER-ART.md` for the current asset placeholders and how to replace them.

## First admin

After starting a fresh local stack, create or promote an admin without committing credentials:

```bash
# Promote an existing user
pnpm admin:bootstrap admin@example.com

# Or create a new user (set the password in the environment, not in source)
ADMIN_PASSWORD="a-strong-password" pnpm admin:bootstrap admin@example.com
```

On Windows PowerShell:

```powershell
$env:ADMIN_PASSWORD = "a-strong-password"
pnpm admin:bootstrap admin@example.com
```

The script uses `SUPABASE_SECRET_KEY` server-side and sets `app_metadata.role = "admin"`. It preserves any existing `app_metadata` keys.

## Order placement RPC

Migration `202611200015_create_place_order_rpc.sql` adds `public.place_order(p_user_id uuid, p_items jsonb, p_shipping_address jsonb, p_customer_email text, p_customer_phone text)`, returning a single JSON object `{ order_id, order_number, total_egp }`.

- The function is `security definer`, sets `search_path = ''`, and fully qualifies `auth.users`, `public.products`, `public.orders`, and `public.order_items`.
- `p_items` is an array of `{ product_id, quantity }` only. Client-supplied prices, names, and SKUs are ignored; the RPC derives `unit_price_egp`, `product_name`, `sku`, and `selected_specs` from locked product rows.
- Products are locked with `FOR UPDATE` in product-ID order. The RPC rejects unpublished/unavailable products and any line whose stock is below the requested quantity, then decrements stock with `stock >= quantity` as a second guard.
- The order header is inserted with the default `pending` status and a unique generated number (`PC-<UTC date>-<random hex>`). Line items and the final total are inserted/updated in the same transaction, so stock and order rows commit atomically.
- `execute` is revoked from `public`, `anon`, and `authenticated` and granted only to `service_role`; the checkout Server Action calls it through `createAdminClient()` after `requireUser()`.
- Generated types cannot be regenerated in this environment, so `features/checkout/lib/place-order-rpc.ts` validates the response with a narrow local Zod schema. Rerun `pnpm db:types` with Docker available and switch to the generated `Functions.place_order` contract.
- Checkout stores the delivery snapshot under the keys in `features/checkout/config/shipping-keys.ts`; `features/orders/schemas/order.ts` parses the same snapshot when rendering order history.

## Phase 6 editing model

- `/admin/banners` edits all banner rows, not only the active/public subset. `mobile_image_path` is optional and falls back to the desktop image at render time. `placement` selects which storefront surface receives the banner.
- `/admin/content` edits `home_sections` directly, including unpublished drafts and `sort_order`. It also edits hero and scroll-step copy through `site_content`; `getHeroSteps()` overlays those strings on the static step config.
- `/admin/settings` edits global `site_content` values: site identity, contact/shipping copy, footer/social links, and SEO metadata.
- `/admin/products` edits products, specs, publication state, featured state, and ordered product images. It reuses the catalog cache tag so the public catalog and home page refresh together.
- `/admin/categories` edits taxonomy, ordering, publication, and category artwork. Deletes preserve order history because `order_items.product_id` uses `set null`.
- `/admin/orders` is read-only except for `status`. Order rows remain immutable snapshots for totals, addresses, and line items.
- All Storage-backed fields store bucket-relative paths. Public queries resolve those paths with `resolveAssetUrl()`; admin actions validate MIME type and file size before upload and delete replaced objects by path.

## Phase 10 content additions

- `bundles` is an extension of the existing `home_sections` kind list; migration `202611200017_add_bundles_home_section.sql` updates the check constraint only. No generated types change is needed.
- Bundle membership and discounts live in `features/bundles/config/bundles.ts`. Public bundle totals are recomputed server-side from validated product rows; no client price is trusted and no new RLS table is introduced.
- The home bundles section uses no special `config` fields. Existing admin controls can publish/hide it and change its title/subtitle/order; bundle contents are now edited from `/admin/bundles` and stored as validated JSON in `site_content`, with TypeScript config as the seed/fallback.
- The old `home.hero.badge` site-content key and the hero section body `badge` value are no longer used and were removed from defaults, seed data, and the admin hero form.

## Phase 12 admin editing model

- `/admin/banners` now owns the hero artwork as well as promo banners. The hero image is a `site-assets` storage path in `home.hero.image`; `home.hero.image_alt` supplies the accessible description. The built-in transparent PNG is used whenever no valid stored path exists.
- `/admin/bundles` creates, edits, and deletes bundle definitions. All definitions live in the single `bundles.definitions` JSON value; no `bundles` table, RLS policy, or generated-type change was added. Product slugs and discounts are revalidated with Zod before the JSON is rewritten.
- `/admin/categories` and `/admin/products` continue to own category artwork and ordered product images. Both use the shared `ImageUploader`, which uploads to Storage first and persists only bucket-relative paths.
- Cache invalidation for hero artwork and bundles uses the existing `site-content` tag, so admin saves refresh the public home, bundles, and settings reads together.
- Missing database relations fall back to built-in defaults or empty admin states so the dashboard renders before migrations are applied. Invalid rows, permission errors, and transport failures still throw and render the shared error boundary.
- **Admin roles:** only `app_metadata.role = "admin"` exists. There are no editor, manager, or viewer tiers. All admins can manage hero artwork, banners, home sections, site content/settings, categories, products, and bundles; view orders, update order status, and print invoices. RLS still blocks non-admins from writes, and Server Actions independently call `requireAdmin()` before parsing input.
