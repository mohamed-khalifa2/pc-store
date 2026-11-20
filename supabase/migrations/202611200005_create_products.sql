create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  sku text not null unique,
  price_egp numeric(12, 2) not null check (price_egp >= 0),
  compare_at_price numeric(12, 2) check (compare_at_price is null or compare_at_price >= price_egp),
  stock integer not null default 0 check (stock >= 0),
  specs jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_slug_idx on public.products (slug);
create index products_category_id_idx on public.products (category_id);
create index products_is_published_idx on public.products (is_published);
create index products_sort_order_idx on public.products (sort_order);
create index products_is_featured_idx on public.products (is_featured);

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

revoke all on table public.products from anon, authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

create policy "products_public_select"
on public.products for select
to anon, authenticated
using (
  is_published
  and (published_at is null or published_at <= now())
);

create policy "products_admin_insert"
on public.products for insert
to authenticated
with check ((select public.is_admin()));

create policy "products_admin_update"
on public.products for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "products_admin_delete"
on public.products for delete
to authenticated
using ((select public.is_admin()));
