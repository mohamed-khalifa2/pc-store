alter table public.home_sections drop constraint if exists home_sections_kind_check;

alter table public.home_sections
  add constraint home_sections_kind_check check (
    kind in (
      'hero',
      'marquee',
      'banners',
      'featured_categories',
      'featured_products',
      'build_cta',
      'why_us',
      'newsletter',
      'footer_cta',
      'category_grid',
      'banner_carousel',
      'rich_text'
    )
  );
