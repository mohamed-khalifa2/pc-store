create table public.banners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image_path text not null,
  headline text,
  subheadline text,
  cta_label text,
  cta_href text,
  sort_order integer not null default 0,
  is_active boolean not null default false,
  published_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index banners_sort_order_idx on public.banners (sort_order);
create index banners_is_active_idx on public.banners (is_active);
create index banners_published_at_idx on public.banners (published_at);

create trigger banners_set_updated_at
before update on public.banners
for each row execute function public.set_updated_at();

alter table public.banners enable row level security;

revoke all on table public.banners from anon, authenticated;

grant select on public.banners to anon, authenticated;
grant insert, update, delete on public.banners to authenticated;
grant all on public.banners to service_role;

create policy "banners_public_select"
on public.banners for select
to anon, authenticated
using (
  is_active
  and (published_at is null or published_at <= now())
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "banners_admin_insert"
on public.banners for insert
to authenticated
with check ((select public.is_admin()));

create policy "banners_admin_update"
on public.banners for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "banners_admin_delete"
on public.banners for delete
to authenticated
using ((select public.is_admin()));
