# Changes

## Neural net: logos, node sizing, header spacing

### Logos wired in (`src/lib/content.ts`)
Added `logo` paths for all five experience entries, pointing at the files in `public/logos/`:

| entry | file |
| --- | --- |
| `tyler` | `/logos/tylertech.png` |
| `simons` | `/logos/stonybrook.jpg` |
| `morgan-stanley` | `/logos/morganstanley.png` |
| `wayne` | `/logos/waynestate.svg` |
| `boardx` | `/logos/boardx.jpg` |

### New `logoFill` flag
- Added optional `logoFill?: boolean` to both the `Job` and `Project` types, threaded through `GraphEntry` in `src/lib/graph.ts`.
- Set `logoFill: true` on `simons`, `morgan-stanley`, and `boardx` — the three marks that ship with a solid/box background.
- In `src/components/experience-graph.tsx` the node image now branches on it:
  - `logoFill` → `size-full scale-105 object-cover`, so the mark bleeds to the node ring and the circle crops the square, leaving only the centre showing.
  - otherwise → `size-[30px] object-contain`, inset (used by `tylertech` and `waynestate`, which are transparent).

### Node size and spacing
- Node diameter `size-11` (44px) → `size-12` (48px), applied to the button, the inner ring span, and the live `animate-ping` halo so all three stay concentric.
- Inset logo box 26px → 30px to match the larger ring.
- Widened both bands in `src/lib/graph.ts` `BANDS` so rows spread further apart:
  - work `{ min: 13, max: 41, gap: 14 }` → `{ min: 11, max: 43, gap: 16 }`
  - project `{ min: 59, max: 89, gap: 13 }` → `{ min: 57, max: 89, gap: 16 }`
- `BAND_BOUNDARY` still resolves to 50, so the divider rule and its "projects" label are unchanged.

### Header spacing (`src/components/experience-view.tsx`)
- Graph section top padding `pt-12 sm:pt-16` → `pt-4 sm:pt-6`.
- Gap between the `01 / Experience` header and the graph `mt-6` → `mt-4`.
- Section height formula (`md:h-[calc(100dvh-8.5rem)]`) untouched, so the ~2.5rem reclaimed from padding goes straight to the net.

## Node colors derived from logo artwork

### `scripts/logo-colors.mjs`
New script, no new dependencies — it uses the `sharp` that Next already installs.

```
node scripts/logo-colors.mjs           # report only
node scripts/logo-colors.mjs --write   # patch src/lib/content.ts in place
```

**One color per entry**, written to both the `light` and `dark` slots. No component change was needed for that — `globals.css` reads `--c` / `--c-dk` through `.node-tint`, so identical values just work. The `NodeColor` pair is now redundant for these five entries but the type is left alone.

The sampling method depends on how the logo sits in its node:

- **Crop logos (`logoFill: true`)** — the artwork bleeds to the ring, so the color is sampled from the artwork's **edge**: the average of pixels in an annulus at 0.86–1.0 of the inscribed radius, which is exactly the band the circle crops along. The ring then continues the logo's own background instead of cutting across it.
- **Transparent logos** — nothing touches the ring, so the color is the **most-used** color in the mark: rasterize to 96px (SVGs at density 300), drop pixels carrying no brand signal (alpha < 128, lightness > 0.93 paper, < 0.07 ink), bin the rest into 24 hue buckets of 15°, score each bucket with its two neighbours so an edge-straddling hue isn't split, and average the winner. Plain averaging is avoided because a navy square with white type averages to slate blue.

**No contrast adjustment.** What the script samples is what it writes — no lightening or darkening to make a color stand off either theme's background. Fidelity to the mark wins, even where that leaves a node dark against the dark theme.

One guard remains:
- **Neutral-edge fallback.** If a crop logo's edge comes back with saturation < 0.15 or lightness outside 0.08–0.9, it's a white or black frame — not a color at all — so the script falls back to the dominant-color path and labels the row `edge→dominant`. This only fires when the edge carries no color to copy, so it isn't a background-contrast adjustment.

Patching is anchored: for each `logo: "/logos/…"` field it rewrites the next `color: { light, dark }` literal, and reads that entry's `logoFill` flag from the same window, bounded by the following `id:` field so neither can leak into the next entry.

### Colors it produced (applied via `--write`)

| entry | mode | color |
| --- | --- | --- |
| `tyler` | dominant | `#415390` |
| `simons` | edge | `#990100` |
| `morgan-stanley` | edge | `#012c51` |
| `wayne` | dominant | `#35746b` |
| `boardx` | edge→dominant (white edge) | `#f25579` |

Notes on individual results:
- `morgan-stanley` `#012c51` and `simons` `#990100` are the true edge navy and red, dark enough that they read as near-black against the dark theme. Accepted deliberately.
- `boardx` took the fallback because its edge is the white JPEG background, which is a frame rather than a color. It may be worth dropping its `logoFill` flag entirely — a white square behind a circle of `bg-surface` looks nearly the same as `object-contain` on the light theme.
- `tyler` picked the navy of its two-tone circle mark over the olive; `wayne` picked the shield green over the gold.

### Remaining hue proximity
`tyler` (`#415390`, hue 227°) and `morgan-stanley` (`#012c51`, hue 207°) both read blue, ~20° apart, though `morgan-stanley` is far darker now. The earlier `simons`/`boardx` red collision resolved itself — `boardx` is a light pink against `simons`' dark red.

