insert into public.categories (
  id, name, slug, description, image_path, sort_order, is_published, published_at
)
values
  ('11111111-1111-4111-8111-111111111101', 'CPUs', 'cpus', 'Processors for every build.', 'categories/cpus.png', 10, true, now()),
  ('11111111-1111-4111-8111-111111111102', 'Motherboards', 'motherboards', 'AM5 and LGA1851 platforms.', 'categories/motherboards.png', 20, true, now()),
  ('11111111-1111-4111-8111-111111111103', 'Graphics Cards', 'graphics-cards', 'GPU power for gaming and content creation.', 'categories/graphics-cards.png', 30, true, now()),
  ('11111111-1111-4111-8111-111111111104', 'Memory', 'memory', 'High-speed DDR5 kits.', 'categories/memory.png', 40, true, now()),
  ('11111111-1111-4111-8111-111111111105', 'Storage', 'storage', 'NVMe drives and fast storage.', 'categories/storage.png', 50, true, now()),
  ('11111111-1111-4111-8111-111111111106', 'PC Cases', 'pc-cases', 'Airflow-first enclosures.', 'categories/pc-cases.png', 60, true, now()),
  ('11111111-1111-4111-8111-111111111107', 'Power Supplies', 'power-supplies', 'Reliable ATX 3.1 power.', 'categories/power-supplies.webp', 70, true, now()),
  ('11111111-1111-4111-8111-111111111108', 'CPU Coolers', 'cpu-coolers', 'Air and liquid cooling.', 'categories/cpu-coolers.webp', 80, true, now()),
  ('11111111-1111-4111-8111-111111111109', 'Monitors', 'monitors', 'High-refresh displays.', 'categories/monitors.webp', 90, true, now()),
  ('11111111-1111-4111-8111-111111111110', 'Refurbished', 'refurbished', 'Hidden category used for RLS checks.', null, 999, false, null)
on conflict (slug) do nothing;

insert into public.products (
  id, category_id, name, slug, description, sku, price_egp, compare_at_price,
  stock, specs, is_featured, is_published, published_at, sort_order
)
values
  ('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111101', 'AMD Ryzen 7 9800X3D', 'ryzen-7-9800x3d', '8-core 3D V-Cache gaming processor.', 'CPU-AMD-9800X3D', 18999.00, 20999.00, 24, $json${"socket":"AM5","cores":8,"boost_ghz":5.2,"cache_mb":96}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111101', 'Intel Core Ultra 9 285K', 'core-ultra-9-285k', '24-core desktop processor.', 'CPU-INTEL-285K', 21999.00, null, 12, $json${"socket":"LGA1851","cores":24,"boost_ghz":5.7}$json$::jsonb, true, true, now(), 20),
  ('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111102', 'ASUS ROG Strix X870E-E', 'asus-rog-strix-x870e-e', 'Flagship AM5 motherboard.', 'MB-ASUS-X870E-E', 15999.00, null, 8, $json${"chipset":"X870E","form_factor":"ATX","memory":"DDR5"}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111102', 'MSI MAG B850 Tomahawk', 'msi-mag-b850-tomahawk', 'Solid AM5 board for builders.', 'MB-MSI-B850-TOMAHAWK', 8499.00, 9299.00, 18, $json${"chipset":"B850","form_factor":"ATX","memory":"DDR5"}$json$::jsonb, false, true, now(), 20),
  ('22222222-2222-4222-8222-222222222205', '11111111-1111-4111-8111-111111111103', 'NVIDIA GeForce RTX 5080', 'rtx-5080', '4K gaming with DLSS 4.', 'GPU-NV-5080', 48999.00, null, 6, $json${"vram_gb":16,"architecture":"Blackwell","bus":"PCIe 5.0"}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222206', '11111111-1111-4111-8111-111111111103', 'AMD Radeon RX 9070 XT', 'rx-9070-xt', 'High-refresh 1440p performance.', 'GPU-AMD-9070XT', 28999.00, 31999.00, 10, $json${"vram_gb":16,"architecture":"RDNA 4","bus":"PCIe 5.0"}$json$::jsonb, true, true, now(), 20),
  ('22222222-2222-4222-8222-222222222207', '11111111-1111-4111-8111-111111111104', 'Corsair Vengeance 32GB DDR5-6000', 'corsair-vengeance-32gb-ddr5-6000', 'Low-profile 32GB dual channel kit.', 'RAM-COR-32-6000', 5299.00, null, 40, $json${"capacity_gb":32,"speed_mts":6000,"cl":30}$json$::jsonb, false, true, now(), 10),
  ('22222222-2222-4222-8222-222222222208', '11111111-1111-4111-8111-111111111104', 'G.Skill Trident Z5 Neo 32GB', 'gskill-trident-z5-neo-32gb', 'EXPO-tuned DDR5 kit.', 'RAM-GSK-32-6000', 5899.00, 6499.00, 28, $json${"capacity_gb":32,"speed_mts":6000,"cl":30}$json$::jsonb, true, true, now(), 20),
  ('22222222-2222-4222-8222-222222222209', '11111111-1111-4111-8111-111111111105', 'Samsung 990 PRO 2TB', 'samsung-990-pro-2tb', 'PCIe 4.0 NVMe flagship.', 'SSD-SAM-990PRO-2TB', 6999.00, null, 35, $json${"capacity_tb":2,"interface":"PCIe 4.0","read_mbs":7450}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222210', '11111111-1111-4111-8111-111111111105', 'WD Black SN850X 1TB', 'wd-black-sn850x-1tb', 'Low-latency gaming NVMe.', 'SSD-WD-SN850X-1TB', 4199.00, 4699.00, 30, $json${"capacity_tb":1,"interface":"PCIe 4.0","read_mbs":7300}$json$::jsonb, false, true, now(), 20),
  ('22222222-2222-4222-8222-222222222211', '11111111-1111-4111-8111-111111111106', 'Lian Li O11 Dynamic EVO XL', 'lian-li-o11-dynamic-evo-xl', 'Showcase case with dual-chamber layout.', 'CASE-LIAN-O11-EVO-XL', 8999.00, null, 9, $json${"form_factor":"ATX","side_panel":"Tempered glass","fans_included":0}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222212', '11111111-1111-4111-8111-111111111106', 'NZXT H7 Flow', 'nzxt-h7-flow', 'Airflow-focused mid tower.', 'CASE-NZXT-H7-FLOW', 5499.00, 5999.00, 16, $json${"form_factor":"ATX","side_panel":"Tempered glass","fans_included":2}$json$::jsonb, false, true, now(), 20),
  ('22222222-2222-4222-8222-222222222213', '11111111-1111-4111-8111-111111111107', 'Corsair RM1000x', 'corsair-rm1000x', '1000W ATX 3.1 fully modular PSU.', 'PSU-COR-RM1000X', 7999.00, null, 14, $json${"wattage":1000,"efficiency":"80+ Gold","modular":true}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222214', '11111111-1111-4111-8111-111111111107', 'Seasonic Vertex GX-850', 'seasonic-vertex-gx-850', '850W ATX 3.1 power supply.', 'PSU-SEA-VERTEX-GX850', 6299.00, 6999.00, 20, $json${"wattage":850,"efficiency":"80+ Gold","modular":true}$json$::jsonb, false, true, now(), 20),
  ('22222222-2222-4222-8222-222222222215', '11111111-1111-4111-8111-111111111108', 'Noctua NH-D15 G2', 'noctua-nh-d15-g2', 'Premium dual-tower air cooler.', 'COOL-NOC-NHD15G2', 5499.00, null, 22, $json${"type":"Air","height_mm":168,"sockets":["AM5","LGA1851"]}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222216', '11111111-1111-4111-8111-111111111108', 'Arctic Liquid Freezer III 360', 'arctic-liquid-freezer-iii-360', '360mm AIO with VRM fan.', 'COOL-ARC-LF3-360', 4299.00, 4799.00, 26, $json${"type":"Liquid","radiator_mm":360,"sockets":["AM5","LGA1851"]}$json$::jsonb, false, true, now(), 20),
  ('22222222-2222-4222-8222-222222222217', '11111111-1111-4111-8111-111111111109', 'LG UltraGear 27GS95QE', 'lg-ultragear-27gs95qe', '27-inch OLED 240Hz monitor.', 'MON-LG-27GS95QE', 32999.00, null, 7, $json${"size_in":27,"panel":"OLED","refresh_hz":240}$json$::jsonb, true, true, now(), 10),
  ('22222222-2222-4222-8222-222222222218', '11111111-1111-4111-8111-111111111109', 'Dell Alienware AW2725DF', 'dell-alienware-aw2725df', '27-inch QD-OLED 360Hz monitor.', 'MON-DELL-AW2725DF', 36999.00, 39999.00, 5, $json${"size_in":27,"panel":"QD-OLED","refresh_hz":360}$json$::jsonb, true, true, now(), 20),
  ('22222222-2222-4222-8222-222222222219', '11111111-1111-4111-8111-111111111109', 'Keychron Q1 HE', 'keychron-q1-he', 'Hall-effect wireless mechanical keyboard.', 'KB-KEYCHRON-Q1HE', 8999.00, null, 11, $json${"layout":"75%","switches":"Hall effect","wireless":true}$json$::jsonb, true, true, now(), 30),
  ('22222222-2222-4222-8222-222222222220', '11111111-1111-4111-8111-111111111110', 'Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2', 'Unpublished sample used for RLS checks.', 'MOUSE-LOGI-GPX2', 4499.00, null, 15, $json${"weight_g":60,"wireless":true}$json$::jsonb, false, false, null, 999)
on conflict (slug) do nothing;

insert into public.banners (
  id, name, image_path, headline, subheadline, cta_label, cta_href,
  sort_order, is_active, published_at, starts_at, ends_at
)
values
  ('33333333-3333-4333-8333-333333333301', 'Build Week', 'banners/build-week.webp', 'Build week is live', 'Upgrade your rig with tuned component bundles.', 'Shop bundles', '/bundles', 10, true, now(), null, null),
  ('33333333-3333-4333-8333-333333333302', 'GPU Drop', 'banners/gpu-drop.webp', 'Next-gen GPUs landed', 'Find the right card for 1440p and 4K.', 'Browse GPUs', '/categories/graphics-cards', 20, true, now(), null, null),
  ('33333333-3333-4333-8333-333333333303', 'Draft Campaign', 'banners/draft.webp', 'Draft banner', 'Hidden from the public site.', 'Coming soon', '/', 999, false, null, null, null)
on conflict (name) do nothing;

insert into public.site_content (key, value, is_published, published_at)
values
  ('site.name', $json$"PC//STORE"$json$::jsonb, true, now()),
  ('site.description', $json$"High-performance PC parts, prebuilts, and upgrades."$json$::jsonb, true, now()),
  ('contact.email', $json$"sales@example.com"$json$::jsonb, true, now()),
  ('contact.phone', $json$"+20 100 000 0000"$json$::jsonb, true, now()),
  ('shipping.note', $json$"Free Cairo delivery on orders above 10,000 EGP."$json$::jsonb, true, now()),
  ('seo.home_title', $json$"PC//STORE — Builds that refuse to compromise"$json$::jsonb, true, now())
on conflict (key) do update
set value = excluded.value,
    is_published = excluded.is_published,
    published_at = excluded.published_at;

insert into public.home_sections (
  key, kind, title, subtitle, body, config, sort_order, is_published, published_at
)
values
  ('home.hero', 'hero', 'Built for the next level', 'Parts, prebuilts, and expert support.', $json${}$json$::jsonb, $json${}$json$::jsonb, 10, true, now()),
  ('home.marquee', 'marquee', 'Trusted by builders', null, $json${}$json$::jsonb, $json${"items":["AMD","NVIDIA","ASUS","MSI","CORSAIR","SAMSUNG"]}$json$::jsonb, 20, true, now()),
  ('home.banners', 'banners', 'Latest drops', 'Campaigns and launches.', $json${}$json$::jsonb, $json${"limit":3,"variants":["full","split","strip"]}$json$::jsonb, 30, true, now()),
  ('home.categories', 'featured_categories', 'Shop by category', 'Find the right upgrade fast.', $json${}$json$::jsonb, $json${"limit":6}$json$::jsonb, 40, true, now()),
  ('home.featured', 'featured_products', 'Featured builds', 'Hand-picked components for serious builders.', $json${}$json$::jsonb, $json${"limit":4}$json$::jsonb, 50, true, now()),
  ('home.bundles', 'bundles', 'Ready-made bundles', 'Matched components that land well together, with the bundle saving already applied.', $json${}$json$::jsonb, $json${}$json$::jsonb, 55, true, now()),
  ('home.build_cta', 'build_cta', 'Build with confidence', 'Pick compatible parts without the guesswork.', $json${}$json$::jsonb, $json${"label":"Start a build","href":"/products"}$json$::jsonb, 60, true, now()),
  ('home.promise', 'why_us', 'Why PC//STORE', 'Built by builders, backed by real support.', $json${"points":["Verified parts","Fast delivery","Upgrade advice","Builder-tested picks"]}$json$::jsonb, $json${}$json$::jsonb, 70, true, now()),
  ('home.newsletter', 'newsletter', 'Stay in the loop', 'Drops, deals, and build guides. No noise.', $json${}$json$::jsonb, $json${}$json$::jsonb, 80, true, now()),
  ('home.footer_cta', 'footer_cta', 'Ready to upgrade?', 'The next build starts here.', $json${}$json$::jsonb, $json${"label":"Shop all parts","href":"/products"}$json$::jsonb, 90, true, now())
on conflict (key) do update
set kind = excluded.kind,
    title = excluded.title,
    subtitle = excluded.subtitle,
    body = excluded.body,
    config = excluded.config,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published,
    published_at = excluded.published_at;
