create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index site_content_key_idx on public.site_content (key);
create index site_content_is_published_idx on public.site_content (is_published);

create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

revoke all on table public.site_content from anon, authenticated;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
grant all on public.site_content to service_role;

create policy "site_content_public_select"
on public.site_content for select
to anon, authenticated
using (
  is_published
  and (published_at is null or published_at <= now())
);

create policy "site_content_admin_insert"
on public.site_content for insert
to authenticated
with check ((select public.is_admin()));

create policy "site_content_admin_update"
on public.site_content for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "site_content_admin_delete"
on public.site_content for delete
to authenticated
using ((select public.is_admin()));
