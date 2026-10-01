import type {
  MapToken,
  NeutralMapToken,
  PaletteTokens,
  SeedToken,
  ShadowMapToken,
  StatusName,
  StatusSemantic,
  StatusSemanticTokens,
} from '../../interface';

const STATUS_SEED_KEY = {
  Primary: 'colorPrimary',
  Success: 'colorSuccess',
  Warning: 'colorWarning',
  Error: 'colorError',
  Info: 'colorInfo',
} as const satisfies Record<StatusName, keyof SeedToken>;

/** Which palette step (1-based) backs each semantic name. Step 6 is the base color itself. */
const SEMANTIC_STEP: Record<StatusSemantic, number> = {
  Bg: 1,
  BgHover: 2,
  Border: 3,
  BorderHover: 4,
  Hover: 5,
  Active: 7,
  TextHover: 8,
  Text: 9,
  TextActive: 10,
};

export type PaletteGenerator = (color: string) => string[];

type ColorMapToken = Pick<
  MapToken,
  'colorPrimary' | 'colorSuccess' | 'colorWarning' | 'colorError' | 'colorInfo'
> &
  PaletteTokens &
  StatusSemanticTokens;

/**
 * Expand each functional seed color into:
 *   - `colorPrimary1..10`  the raw palette
 *   - `colorPrimaryBg`, `colorPrimaryHover`, ... named views onto that palette
 *   - `colorPrimary`       palette step 6 (== the seed in light mode, a blended tone in dark mode)
 */
export function genColorMapToken(seed: SeedToken, generate: PaletteGenerator): ColorMapToken {
  const out: Record<string, string> = {};

  (Object.keys(STATUS_SEED_KEY) as StatusName[]).forEach((name) => {
    const palette = generate(seed[STATUS_SEED_KEY[name]]);
    palette.forEach((color, i) => {
      out[`color${name}${i + 1}`] = color;
    });
    out[STATUS_SEED_KEY[name]] = palette[5] as string;
    (Object.keys(SEMANTIC_STEP) as StatusSemantic[]).forEach((semantic) => {
      out[`color${name}${semantic}`] = palette[SEMANTIC_STEP[semantic] - 1] as string;
    });
  });

  return out as unknown as ColorMapToken;
}

export const lightNeutralTokens: NeutralMapToken = {
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
  colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
  colorFill: 'rgba(0, 0, 0, 0.15)',
  colorFillSecondary: 'rgba(0, 0, 0, 0.06)',
  colorFillTertiary: 'rgba(0, 0, 0, 0.04)',
  colorFillQuaternary: 'rgba(0, 0, 0, 0.02)',
  colorBgLayout: '#f5f5f5',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
  colorSplit: 'rgba(5, 5, 5, 0.06)',
};

export const darkNeutralTokens: NeutralMapToken = {
  colorText: 'rgba(255, 255, 255, 0.85)',
  colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
  colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
  colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
  colorFill: 'rgba(255, 255, 255, 0.18)',
  colorFillSecondary: 'rgba(255, 255, 255, 0.12)',
  colorFillTertiary: 'rgba(255, 255, 255, 0.08)',
  colorFillQuaternary: 'rgba(255, 255, 255, 0.04)',
  colorBgLayout: '#000000',
  colorBgContainer: '#141414',
  colorBgElevated: '#1f1f1f',
  colorBorder: '#424242',
  colorBorderSecondary: '#303030',
  colorSplit: 'rgba(253, 253, 253, 0.12)',
};

export const lightShadowTokens: ShadowMapToken = {
  boxShadowCard:
    '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
  boxShadowDropdown:
    '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  boxShadowPopup:
    '0 12px 32px 4px rgba(0, 0, 0, 0.12), 0 8px 20px 0 rgba(0, 0, 0, 0.16), 0 4px 8px -4px rgba(0, 0, 0, 0.2)',
};

export const darkShadowTokens: ShadowMapToken = {
  boxShadowCard:
    '0 1px 2px 0 rgba(0, 0, 0, 0.16), 0 1px 6px -1px rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.12)',
  boxShadowDropdown:
    '0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 9px 28px 8px rgba(0, 0, 0, 0.2)',
  boxShadowPopup:
    '0 12px 32px 4px rgba(0, 0, 0, 0.48), 0 8px 20px 0 rgba(0, 0, 0, 0.64), 0 4px 8px -4px rgba(0, 0, 0, 0.8)',
};
