create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  sku text,
  unit_price_egp numeric(12, 2) not null check (unit_price_egp >= 0),
  quantity integer not null check (quantity > 0),
  line_total_egp numeric(12, 2) generated always as (quantity::numeric * unit_price_egp) stored,
  selected_specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);

alter table public.order_items enable row level security;

revoke all on table public.order_items from anon, authenticated;

grant select on public.order_items to anon, authenticated;
grant insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;

create policy "order_items_select_own_or_admin"
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and (
        public.orders.user_id = (select auth.uid())
        or (select public.is_admin())
      )
  )
);

create policy "order_items_admin_insert"
on public.order_items for insert
to authenticated
with check ((select public.is_admin()));

create policy "order_items_admin_update"
on public.order_items for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "order_items_admin_delete"
on public.order_items for delete
to authenticated
using ((select public.is_admin()));
