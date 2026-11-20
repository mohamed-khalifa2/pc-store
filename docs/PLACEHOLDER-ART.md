# Placeholder artwork and real asset replacement

Phase 4 ships lightweight SVG placeholders so the home page is complete without binary assets. Replace them with transparent WebP renders before launch.

## Current placeholders

| Area       | Path                                 | View box   | Notes                       |
| ---------- | ------------------------------------ | ---------- | --------------------------- |
| Hero parts | `public/images/hero/parts/*.svg`     | `900×900`  | One file per PC component   |
| Banners    | `public/images/banners/*.svg`        | `1600×900` | Full-bleed campaign artwork |
| Categories | `public/images/categories/*.svg`     | `600×400`  | Category cards              |
| Products   | `public/images/products/generic.svg` | `800×600`  | Shared product fallback     |

The hero parts are:

- `frame.svg`
- `motherboard.svg`
- `gpu.svg`
- `psu.svg`
- `fans.svg`
- `ram.svg`
- `front-panel.svg`
- `side-panel.svg`

## Hero part replacement

1. Render every part at `900×900` with a transparent alpha channel.
2. Export as WebP with quality `90`, sRGB color, and no baked-in shadow or background.
3. Keep generous transparent padding so GSAP transforms do not clip at the edges.
4. Use the same silhouette alignment and center point as the placeholder; the timeline assumes all layers share the `900×900` stage.
5. Name files exactly as follows in `public/images/hero/parts/`:

   `frame.webp`, `motherboard.webp`, `gpu.webp`, `psu.webp`, `fans.webp`, `ram.webp`, `front-panel.webp`, `side-panel.webp`

6. Update the `image` field for each entry in `src/features/scroll-hero/config/parts.ts` from `.svg` to `.webp`.
7. Keep `preload` only on the first part (`frame.webp`). Do not preload the rest.

Mobile hides `front-panel.webp` and `side-panel.webp` through each part's `mobile: false` flag.

## Banner and card replacement

- Export banners at `1600×900` as WebP. They may be opaque because the green gradient is applied by `ParallaxBanner`.
- Export category art at `600×400` and product art at `800×600` as WebP.
- Upload banners to the `banners` bucket and cards to `site-assets` using the paths already present in `supabase/seed.sql`, for example `banners/build-week.webp`.
- Local placeholder files remain in `public/images/` as fallback/default sources.

## Format checklist

- Transparent background for hero parts; opaque is acceptable for banners and cards.
- WebP, modern compression, no embedded metadata.
- Exact filenames and dimensions above.
- No baked text that duplicates the headline copy.
- Respect the green/black design system and keep contrast high over the dark base.
