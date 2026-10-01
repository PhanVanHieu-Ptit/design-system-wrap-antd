import { hsvToRgb, mix, parseHex, rgbToHsv, toHex } from './color';
import type { HSV } from './color';

/**
 * Palette generation (Ant Design Colors algorithm).
 *
 * Given one base color, produce 10 steps:
 *   index 0..4  -> 5 lighter tints   (colorX-1 .. colorX-5)
 *   index 5     -> the base color    (colorX-6)
 *   index 6..9  -> 4 darker shades   (colorX-7 .. colorX-10)
 *
 * Light steps lower saturation and raise brightness, dark steps do the opposite. The hue is
 * nudged slightly (warm colors towards yellow, cool colors towards blue) so ramps look natural
 * instead of just "washed out".
 */

export interface GeneratePaletteOptions {
  /** `default` = light UI palette, `dark` = palette blended into `backgroundColor`. */
  theme?: 'default' | 'dark';
  /** Surface the dark palette is blended into. Defaults to `#141414`. */
  backgroundColor?: string;
}

const HUE_STEP = 2;
const SATURATION_STEP = 0.16; // light steps
const SATURATION_STEP2 = 0.05; // dark steps
const BRIGHTNESS_STEP1 = 0.05; // light steps
const BRIGHTNESS_STEP2 = 0.15; // dark steps
const LIGHT_COLOR_COUNT = 5;
const DARK_COLOR_COUNT = 4;

/** How much of each light-ramp step survives when blended into the dark background. */
const DARK_COLOR_MAP: ReadonlyArray<{ index: number; amount: number }> = [
  { index: 7, amount: 15 },
  { index: 6, amount: 25 },
  { index: 5, amount: 30 },
  { index: 5, amount: 45 },
  { index: 5, amount: 65 },
  { index: 5, amount: 85 },
  { index: 4, amount: 90 },
  { index: 3, amount: 95 },
  { index: 2, amount: 97 },
  { index: 1, amount: 98 },
];

const round2 = (n: number) => Number(n.toFixed(2));

function getHue(hsv: HSV, i: number, light: boolean): number {
  const h = Math.round(hsv.h);
  let hue: number;
  if (h >= 60 && h <= 240) {
    hue = light ? h - HUE_STEP * i : h + HUE_STEP * i;
  } else {
    hue = light ? h + HUE_STEP * i : h - HUE_STEP * i;
  }
  if (hue < 0) hue += 360;
  else if (hue >= 360) hue -= 360;
  return hue;
}

function getSaturation(hsv: HSV, i: number, light: boolean): number {
  // Grey stays grey.
  if (hsv.h === 0 && hsv.s === 0) return hsv.s;
  let saturation: number;
  if (light) {
    saturation = hsv.s - SATURATION_STEP * i;
  } else if (i === DARK_COLOR_COUNT) {
    saturation = hsv.s + SATURATION_STEP;
  } else {
    saturation = hsv.s + SATURATION_STEP2 * i;
  }
  if (saturation > 1) saturation = 1;
  // The lightest tint should not be pure white.
  if (light && i === LIGHT_COLOR_COUNT && saturation > 0.1) saturation = 0.1;
  if (saturation < 0.06) saturation = 0.06;
  return round2(saturation);
}

function getValue(hsv: HSV, i: number, light: boolean): number {
  const value = light ? hsv.v + BRIGHTNESS_STEP1 * i : hsv.v - BRIGHTNESS_STEP2 * i;
  return round2(Math.max(0, Math.min(1, value)));
}

/**
 * @example
 * generatePalette('#1677ff')
 * // ['#e6f4ff', '#bae0ff', '#91caff', '#69b1ff', '#4096ff', '#1677ff', '#0958d9', '#003eb3', '#002c8c', '#001d66']
 */
export function generatePalette(color: string, options: GeneratePaletteOptions = {}): string[] {
  const base = parseHex(color);
  const baseHsv = rgbToHsv(base);
  const patterns: string[] = [];

  for (let i = LIGHT_COLOR_COUNT; i > 0; i -= 1) {
    patterns.push(
      toHex(
        hsvToRgb({
          h: getHue(baseHsv, i, true),
          s: getSaturation(baseHsv, i, true),
          v: getValue(baseHsv, i, true),
        }),
      ),
    );
  }

  patterns.push(toHex(base));

  for (let i = 1; i <= DARK_COLOR_COUNT; i += 1) {
    patterns.push(
      toHex(
        hsvToRgb({
          h: getHue(baseHsv, i, false),
          s: getSaturation(baseHsv, i, false),
          v: getValue(baseHsv, i, false),
        }),
      ),
    );
  }

  if (options.theme === 'dark') {
    const background = options.backgroundColor ?? '#141414';
    return DARK_COLOR_MAP.map(({ index, amount }) =>
      mix(background, patterns[index] as string, amount),
    );
  }

  return patterns;
}
