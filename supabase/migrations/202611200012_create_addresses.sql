create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  governorate text not null,
  postal_code text,
  country_code text not null default 'EG',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses (user_id);

create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

alter table public.addresses enable row level security;

revoke all on table public.addresses from anon, authenticated;

grant select on public.addresses to anon, authenticated;
grant insert, update, delete on public.addresses to authenticated;
grant all on public.addresses to service_role;

create policy "addresses_select_own_or_admin"
on public.addresses for select
to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "addresses_admin_insert"
on public.addresses for insert
to authenticated
with check ((select public.is_admin()));

create policy "addresses_admin_update"
on public.addresses for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "addresses_admin_delete"
on public.addresses for delete
to authenticated
using ((select public.is_admin()));
