create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, storage_path)
);

create index product_images_product_id_idx on public.product_images (product_id);
create index product_images_is_active_idx on public.product_images (is_active);
create index product_images_sort_order_idx on public.product_images (sort_order);

create trigger product_images_set_updated_at
before update on public.product_images
for each row execute function public.set_updated_at();

alter table public.product_images enable row level security;

revoke all on table public.product_images from anon, authenticated;

grant select on public.product_images to anon, authenticated;
grant insert, update, delete on public.product_images to authenticated;
grant all on public.product_images to service_role;

create policy "product_images_public_select"
on public.product_images for select
to anon, authenticated
using (
  is_active
  and exists (
    select 1
    from public.products
    where public.products.id = product_images.product_id
      and public.products.is_published
      and (public.products.published_at is null or public.products.published_at <= now())
  )
);

create policy "product_images_admin_insert"
on public.product_images for insert
to authenticated
with check ((select public.is_admin()));

create policy "product_images_admin_update"
on public.product_images for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "product_images_admin_delete"
on public.product_images for delete
to authenticated
using ((select public.is_admin()));
