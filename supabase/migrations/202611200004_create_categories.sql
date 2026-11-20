create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  parent_id uuid references public.categories (id) on delete set null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_slug_idx on public.categories (slug);
create index categories_parent_id_idx on public.categories (parent_id);
create index categories_is_published_idx on public.categories (is_published);
create index categories_sort_order_idx on public.categories (sort_order);

create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

revoke all on table public.categories from anon, authenticated;

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;

create policy "categories_public_select"
on public.categories for select
to anon, authenticated
using (
  is_published
  and (published_at is null or published_at <= now())
);

create policy "categories_admin_insert"
on public.categories for insert
to authenticated
with check ((select public.is_admin()));

create policy "categories_admin_update"
on public.categories for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "categories_admin_delete"
on public.categories for delete
to authenticated
using ((select public.is_admin()));
