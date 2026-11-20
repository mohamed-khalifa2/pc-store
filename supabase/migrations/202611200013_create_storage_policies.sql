-- Bucket sizes and MIME types are also declared in supabase/config.toml.
-- Keep both definitions in sync so local and hosted projects behave the same.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880, array[
    'image/webp', 'image/avif', 'image/jpeg', 'image/png'
  ]),
  ('banners', 'banners', true, 5242880, array[
    'image/webp', 'image/avif', 'image/jpeg', 'image/png'
  ]),
  ('site-assets', 'site-assets', true, 2097152, array[
    'image/webp', 'image/avif', 'image/jpeg', 'image/png', 'image/svg+xml'
  ])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

revoke insert, update, delete on storage.objects from anon;

create policy "storage_assets_public_read"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('product-images', 'banners', 'site-assets'));

create policy "storage_assets_admin_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id in ('product-images', 'banners', 'site-assets')
  and (select public.is_admin())
);

create policy "storage_assets_admin_update"
on storage.objects for update
to authenticated
using (
  bucket_id in ('product-images', 'banners', 'site-assets')
  and (select public.is_admin())
)
with check (
  bucket_id in ('product-images', 'banners', 'site-assets')
  and (select public.is_admin())
);

create policy "storage_assets_admin_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id in ('product-images', 'banners', 'site-assets')
  and (select public.is_admin())
);
