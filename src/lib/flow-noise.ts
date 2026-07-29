export type Rgb = [number, number, number];

// Integer hash -> [0,1). Cheap, stable, and good enough to build noise on.
export function hash2(ix: number, iy: number) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function valueNoise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const u = smoothstep(x - ix);
  const v = smoothstep(y - iy);
  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
}

// Three octaves: broad currents with finer eddies layered on top.
export function fbm(x: number, y: number) {
  return (
    valueNoise(x, y) * 0.6 +
    valueNoise(x * 2.1, y * 2.1) * 0.28 +
    valueNoise(x * 4.3, y * 4.3) * 0.12
  );
}

export function hexToRgb(value: string, fallback: Rgb): Rgb {
  const hex = value.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return fallback;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
