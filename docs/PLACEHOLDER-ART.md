# Artwork sources and replacement

The hero and the six default category images use real PC components with transparent backgrounds. The files are stored locally so `next/image` can optimize them; the remaining banner, product, and extra-category artwork still uses SVG/WebP placeholders.

## Current artwork

| Area           | Local file                                    | Source                                                                                                                                                   | Author                                                | License                                                         |
| -------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------- |
| Hero collage   | `public/images/hero/hero-components.png`      | Composite of the CPU, GPU, memory, storage, and case sources below                                                                                       | See individual sources                                | CC BY-SA 4.0 composite (contains CC BY-SA source images)        |
| CPUs           | `public/images/categories/cpus.png`           | [AMD Ryzen 5 2600 transparent](<https://commons.wikimedia.org/wiki/File:AMD_Ryzen_5_2600_(39851733273)_remix_transparent.png>)                           | Original photo by Fritzchens Fritz; cutout by AGreuet | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| Motherboards   | `public/images/categories/motherboards.png`   | [Motherboards comparison](https://commons.wikimedia.org/wiki/File:Motherboards.png)                                                                      | Kyle Wiens (iFixit), Max Timchenko                    | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)  |
| Graphics cards | `public/images/categories/graphics-cards.png` | [Sapphire Radeon R9 290X transparent](https://commons.wikimedia.org/wiki/File:Sapphire_Radeon_R9_290X-front_oblique_PNr%C2%B00437_remix_transparent.png) | Original photo by D-Kuru; cutout by AGreuet           | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0)        |
| Memory         | `public/images/categories/memory.png`         | [Viper DDR4 RAM](https://commons.wikimedia.org/wiki/File:Viper_DDR4_Ram_-_3004.png)                                                                      | Amada44                                               | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)  |
| Storage        | `public/images/categories/storage.png`        | [Patriot P210 1TB SSD](https://commons.wikimedia.org/wiki/File:2023_Dysk_SSD_Patriot_P210_1TB.jpg)                                                       | Jacek Halicki                                         | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)  |
| PC cases       | `public/images/categories/pc-cases.png`       | [Full Tower computer case](https://commons.wikimedia.org/wiki/File:Computer_case_-_Full_Tower.jpg)                                                       | Dmitry Makeev                                         | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)  |

All sources were retrieved from Wikimedia Commons. The CPU, GPU, memory, and motherboard files already had transparent backgrounds. The SSD and case had uniform studio backgrounds, which were removed with an edge-connected color key before trimming and resizing. The hero collage layers the finished component cutouts on a transparent canvas.

Attribution for the composite: CPU by Fritzchens Fritz / AGreuet (CC0); GPU by D-Kuru / AGreuet (CC BY 3.0); memory by Amada44 (CC BY-SA 3.0); SSD by Jacek Halicki (CC BY-SA 4.0); case by Dmitry Makeev (CC BY-SA 4.0). The collage is shared under CC BY-SA 4.0 because it incorporates CC BY-SA material.

## Remaining placeholders

| Area             | Path                                       | Notes                                                                     |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| Banners          | `public/images/banners/*.svg`              | Full-bleed campaign artwork                                               |
| Products         | `public/images/products/generic.svg`       | Shared product fallback                                                   |
| Extra categories | `categories/*.webp` in `supabase/seed.sql` | Power Supplies, CPU Coolers, and Monitors have no dedicated local art yet |

## Replacement rules

1. Keep transparent backgrounds for hero and category component art. The card/hero images use `object-contain` so the whole component remains visible.
2. Keep generous transparent padding around the hero collage so the parallax and pointer-tilt transforms do not clip it.
3. Store raster images as PNG locally; `next/image` serves optimized modern formats at request time. Remote Supabase paths remain `unoptimized` by design.
4. Update `HERO_ARTWORK` in `src/features/scroll-hero/config/hero-artwork.ts` when replacing the hero image, including its intrinsic width and height.
5. Update `DEFAULT_CATEGORIES` in `src/features/categories/config/defaults.ts`, the matching `image_path` values in `supabase/seed.sql`, and the admin fallback in `src/features/categories/components/admin/CategoryForm.tsx` when replacing category art.
6. Record any new source, author, and license in this file before shipping the asset.
