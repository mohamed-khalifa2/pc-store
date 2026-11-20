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
- Seed keys cover site name/description, contact details, shipping note, and home SEO.
- Admin UI should edit values through keyed forms rather than raw JSON only.

### `home_sections`

- Unique `key`, `kind`, optional `title`/`subtitle`, `body jsonb`, `config jsonb`.
- Current `kind` values: `hero`, `marquee`, `banners`, `featured_categories`, `featured_products`, `build_cta`, `why_us`, `newsletter`, `footer_cta`.
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
