/**
 * Minimal color math (RGB <-> HSV, mixing, alpha) so the token engine has zero dependencies.
 * Only hex input (#rgb / #rrggbb) is supported — that is what seed tokens use.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  /** 0..360 */
  h: number;
  /** 0..1 */
  s: number;
  /** 0..1 */
  v: number;
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const isHexColor = (color: string): boolean => HEX_RE.test(color.trim());

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function parseHex(color: string): RGB {
  const input = color.trim();
  if (!HEX_RE.test(input)) {
    throw new Error(`[@hieu/ui] Unsupported color "${color}". Expected a hex color like #1677ff.`);
  }
  let hex = input.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function toHex({ r, g, b }: RGB): string {
  const part = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s;
  const hh = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const [r1, g1, b1] =
    hh < 1
      ? [c, x, 0]
      : hh < 2
        ? [x, c, 0]
        : hh < 3
          ? [0, c, x]
          : hh < 4
            ? [0, x, c]
            : hh < 5
              ? [x, 0, c]
              : [c, 0, x];
  const m = v - c;
  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 };
}

/**
 * Mix `color2` into `color1`. `amount` is the percentage (0..100) of `color2`.
 * Mirrors tinycolor's `mix`, which Ant Design uses to derive its dark palette.
 */
export function mix(color1: string, color2: string, amount: number): string {
  const a = parseHex(color1);
  const b = parseHex(color2);
  const p = clamp(amount, 0, 100) / 100;
  return toHex({
    r: (b.r - a.r) * p + a.r,
    g: (b.g - a.g) * p + a.g,
    b: (b.b - a.b) * p + a.b,
  });
}

/** `#1677ff` + 0.1 -> `rgba(22, 119, 255, 0.1)` */
export function toRgba(color: string, alpha: number): string {
  const { r, g, b } = parseHex(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
