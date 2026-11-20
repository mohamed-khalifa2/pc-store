create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references auth.users (id) on delete restrict,
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
  ),
  total_egp numeric(12, 2) not null check (total_egp >= 0),
  currency text not null default 'EGP',
  customer_email text,
  customer_phone text,
  shipping_address jsonb not null default '{}'::jsonb,
  billing_address jsonb,
  placed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index orders_placed_at_idx on public.orders (placed_at);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

revoke all on table public.orders from anon, authenticated;

grant select on public.orders to anon, authenticated;
grant insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;

create policy "orders_select_own_or_admin"
on public.orders for select
to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "orders_admin_insert"
on public.orders for insert
to authenticated
with check ((select public.is_admin()));

create policy "orders_admin_update"
on public.orders for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "orders_admin_delete"
on public.orders for delete
to authenticated
using ((select public.is_admin()));
