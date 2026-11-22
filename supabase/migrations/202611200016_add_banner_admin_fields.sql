alter table public.banners
  add column if not exists mobile_image_path text,
  add column if not exists placement text not null default 'home'
    check (placement in ('home', 'category', 'cart', 'checkout'));

create index if not exists banners_placement_idx on public.banners (placement);
