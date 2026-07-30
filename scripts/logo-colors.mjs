/**
 * Derives each entry's node color from its logo artwork.
 *
 *   node scripts/logo-colors.mjs           # report only
 *   node scripts/logo-colors.mjs --write   # patch src/lib/content.ts in place
 *
 * One color per entry, written to both the light and dark slots, chosen by how
 * the logo actually sits in its node:
 *
 *   crop logos (logoFill: true)  — the artwork bleeds to the node ring, so the
 *     color is sampled from the artwork's edge: an annulus just inside the
 *     circle the UI crops to. That makes the ring continue the logo's own
 *     background instead of cutting across it.
 *
 *   transparent logos            — nothing touches the ring, so the color is the
 *     most-used color in the mark. Averaging every pixel would give mud, so
 *     pixels carrying no brand signal are dropped and the rest are binned by
 *     hue; the heaviest bin wins.
 *
 * What it samples is what it writes — no lightening or darkening to clear
 * contrast against either theme's background. Fidelity to the mark wins.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT = path.join(ROOT, "src/lib/content.ts");
const PUBLIC = path.join(ROOT, "public");

const SAMPLE = 96;
/** 15° per bin; the winner is averaged with its two neighbours. */
const HUE_BINS = 24;
/** Below this saturation a pixel is treated as ink or paper, not brand color. */
const NEUTRAL_SAT = 0.15;
/** Fraction of the radius that counts as "the edge" for crop logos. */
const EDGE_BAND = [0.86, 1];

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

function rgbToHsl(r, g, b) {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === rn
      ? ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60
      : max === gn
        ? ((bn - rn) / d + 2) * 60
        : ((rn - gn) / d + 4) * 60;
  return { h, s, l };
}

const toHex = ({ r, g, b }) =>
  `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0")).join("")}`;

async function pixels(file) {
  const { data, info } = await sharp(file, { density: 300 })
    .resize(SAMPLE, SAMPLE, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

/**
 * Average color of the artwork's outer edge — what the node's ring sits against
 * once the circle crops the square.
 */
async function edgeColor(file) {
  const { data, width, height, channels } = await pixels(file);
  const [cx, cy] = [(width - 1) / 2, (height - 1) / 2];
  const radius = Math.min(cx, cy);
  const acc = { n: 0, r: 0, g: 0, b: 0 };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const d = Math.hypot(x - cx, y - cy) / radius;
      if (d < EDGE_BAND[0] || d > EDGE_BAND[1]) continue;

      const i = (y * width + x) * channels;
      if (data[i + 3] < 128) continue;
      acc.n += 1;
      acc.r += data[i];
      acc.g += data[i + 1];
      acc.b += data[i + 2];
    }
  }

  if (!acc.n) return null;
  return { r: acc.r / acc.n, g: acc.g / acc.n, b: acc.b / acc.n };
}

/** The most-used chromatic color of an image, or null if it has none. */
async function dominantColor(file) {
  const { data, channels } = await pixels(file);
  const bins = Array.from({ length: HUE_BINS }, () => ({ n: 0, r: 0, g: 0, b: 0 }));
  const neutral = { n: 0, r: 0, g: 0, b: 0 };

  for (let i = 0; i < data.length; i += channels) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 128) continue;

    const { h, s, l } = rgbToHsl(r, g, b);
    // Paper and ink: a white field or a black outline is not the brand color.
    if (l > 0.93 || l < 0.07) continue;

    const target =
      s < NEUTRAL_SAT ? neutral : bins[Math.floor(h / (360 / HUE_BINS)) % HUE_BINS];
    target.n += 1;
    target.r += r;
    target.g += g;
    target.b += b;
  }

  // Weight each bin with its neighbours so a hue straddling a bin edge isn't split.
  let best = null;
  for (let i = 0; i < HUE_BINS; i += 1) {
    const window = [bins.at(i - 1), bins[i], bins[(i + 1) % HUE_BINS]];
    const n = window.reduce((sum, bin) => sum + bin.n, 0);
    if (n && (!best || n > best.n)) best = { n, bins: window };
  }

  // A wholly greyscale mark still deserves a tint rather than a crash.
  const pick = best ?? (neutral.n ? { n: neutral.n, bins: [neutral] } : null);
  if (!pick) return null;
  const sum = (channel) => pick.bins.reduce((total, bin) => total + bin[channel], 0);
  return { r: sum("r") / pick.n, g: sum("g") / pick.n, b: sum("b") / pick.n };
}

const COLOR_RE =
  /color:\s*\{\s*light:\s*"(#[0-9a-fA-F]{3,8})",\s*dark:\s*"(#[0-9a-fA-F]{3,8})"\s*\}/;

async function main() {
  const write = process.argv.includes("--write");
  let source = await readFile(CONTENT, "utf8");

  const logos = [...source.matchAll(/logo:\s*"(\/logos\/[^"]+)"/g)];
  if (!logos.length) throw new Error("no logo: fields found in content.ts");

  const rows = [];

  for (const match of logos) {
    const rel = match[1];
    const file = path.join(PUBLIC, rel);

    // The color literal and the logoFill flag belong to this entry only if they
    // land before the next entry starts, so bound the window at the next `id:`.
    const from = match.index + match[0].length;
    const nextId = source.indexOf('id: "', from);
    const window = source.slice(from, nextId === -1 ? undefined : nextId);
    const crop = /logoFill:\s*true/.test(window);

    let mode = crop ? "edge" : "dominant";
    let base = crop ? await edgeColor(file) : await dominantColor(file);

    // A white or black edge is a frame, not a brand color — it would leave the
    // node ring invisible against one theme or the other. Fall back to the mark.
    if (crop && base) {
      const { s, l } = rgbToHsl(base.r, base.g, base.b);
      if (s < NEUTRAL_SAT || l > 0.9 || l < 0.08) {
        mode = "edge→dominant (neutral edge)";
        base = await dominantColor(file);
      }
    }

    if (!base) {
      rows.push({ rel, mode, note: "no usable pixels — left alone" });
      continue;
    }

    // Sampled color goes in as-is; no contrast adjustment against either theme.
    const color = toHex(base);
    const found = window.match(COLOR_RE);

    if (!found) {
      rows.push({ rel, mode, color, note: "no color literal found — not patched" });
      continue;
    }

    rows.push({ rel, mode, color, was: found[1] });

    if (write) {
      const replacement = `color: { light: "${color}", dark: "${color}" }`;
      source =
        source.slice(0, from) +
        window.replace(COLOR_RE, replacement) +
        (nextId === -1 ? "" : source.slice(nextId));
    }
  }

  console.log("logo".padEnd(26), "mode".padEnd(28), "was".padEnd(9), "color");
  for (const row of rows) {
    console.log(
      row.rel.padEnd(26),
      row.mode.padEnd(28),
      (row.was ?? "—").padEnd(9),
      (row.color ?? "—").padEnd(9),
      row.note ?? "",
    );
  }

  if (write) {
    await writeFile(CONTENT, source);
    console.log(`\npatched ${path.relative(ROOT, CONTENT)}`);
  } else {
    console.log("\nreport only — pass --write to patch content.ts");
  }
}

await main();
