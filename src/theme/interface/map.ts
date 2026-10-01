import type { SeedToken } from './seed';

/**
 * Layer 2 — Map Tokens.
 *
 * Gradient variables produced from the seeds by a *mapping algorithm* (default / dark).
 * A map token answers "what are all the shades, sizes and radii this seed implies?".
 */

export type PaletteIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type StatusName = 'Primary' | 'Success' | 'Warning' | 'Error' | 'Info';
export type StatusSemantic =
  | 'Bg'
  | 'BgHover'
  | 'Border'
  | 'BorderHover'
  | 'Hover'
  | 'Active'
  | 'TextHover'
  | 'Text'
  | 'TextActive';

/** colorPrimary1 ... colorPrimary10, colorSuccess1 ... colorInfo10 */
export type PaletteTokens = { [K in `color${StatusName}${PaletteIndex}`]: string };

/** colorPrimaryBg, colorPrimaryHover, colorErrorActive, ... (named views onto the palette steps) */
export type StatusSemanticTokens = { [K in `color${StatusName}${StatusSemantic}`]: string };

export interface NeutralMapToken {
  colorText: string;
  colorTextSecondary: string;
  colorTextTertiary: string;
  colorTextQuaternary: string;
  colorFill: string;
  colorFillSecondary: string;
  colorFillTertiary: string;
  colorFillQuaternary: string;
  colorBgLayout: string;
  colorBgContainer: string;
  colorBgElevated: string;
  colorBorder: string;
  colorBorderSecondary: string;
  colorSplit: string;
}

/** Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 for sizeUnit = 4. */
export interface SizeMapToken {
  sizeXXS: number;
  sizeXS: number;
  sizeSM: number;
  sizeMD: number;
  sizeLG: number;
  sizeXL: number;
  sizeXXL: number;
}

export interface FontMapToken {
  fontSizeSM: number;
  fontSizeLG: number;
  fontSizeXL: number;
  /** Unitless. 22px / 14px = 1.5714285714285714 */
  lineHeight: number;
  lineHeightLG: number;
  lineHeightSM: number;
}

export interface StyleMapToken {
  borderRadiusXS: number;
  borderRadiusSM: number;
  borderRadiusLG: number;
}

export interface HeightMapToken {
  controlHeightSM: number;
  controlHeightLG: number;
}

export interface MotionMapToken {
  motionDurationFast: string;
  motionDurationMid: string;
  motionDurationSlow: string;
  motionEaseInOut: string;
  motionEaseOut: string;
  motionEaseInOutCirc: string;
  motionEaseOutCirc: string;
}

/** Three elevation levels. */
export interface ShadowMapToken {
  /** Resting surfaces: cards, inputs on hover. */
  boxShadowCard: string;
  /** Floating panels: dropdowns, popovers, tooltips. */
  boxShadowDropdown: string;
  /** Blocking layers: modals, drawers, popups. */
  boxShadowPopup: string;
}

export interface MapToken
  extends
    SeedToken,
    PaletteTokens,
    StatusSemanticTokens,
    NeutralMapToken,
    SizeMapToken,
    FontMapToken,
    StyleMapToken,
    HeightMapToken,
    MotionMapToken,
    ShadowMapToken {}
