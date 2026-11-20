create table public.home_sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  kind text not null check (
    kind in ('hero', 'featured_products', 'category_grid', 'banner_carousel', 'rich_text')
  ),
  title text,
  subtitle text,
  body jsonb not null default '{}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index home_sections_key_idx on public.home_sections (key);
create index home_sections_is_published_idx on public.home_sections (is_published);
create index home_sections_sort_order_idx on public.home_sections (sort_order);

create trigger home_sections_set_updated_at
before update on public.home_sections
for each row execute function public.set_updated_at();

alter table public.home_sections enable row level security;

revoke all on table public.home_sections from anon, authenticated;

grant select on public.home_sections to anon, authenticated;
grant insert, update, delete on public.home_sections to authenticated;
grant all on public.home_sections to service_role;

create policy "home_sections_public_select"
on public.home_sections for select
to anon, authenticated
using (
  is_published
  and (published_at is null or published_at <= now())
);

create policy "home_sections_admin_insert"
on public.home_sections for insert
to authenticated
with check ((select public.is_admin()));

create policy "home_sections_admin_update"
on public.home_sections for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "home_sections_admin_delete"
on public.home_sections for delete
to authenticated
using ((select public.is_admin()));
