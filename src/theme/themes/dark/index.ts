import type { MappingAlgorithm } from '../../interface';
import { generatePalette } from '../../utils/generatePalette';
import { defaultAlgorithm } from '../default';
import { darkNeutralTokens, darkShadowTokens, genColorMapToken } from '../shared/genColorMapToken';

const DARK_BG = darkNeutralTokens.colorBgContainer;

/**
 * Dark theme. A *color-only* overlay: it keeps sizes/fonts/motion from whatever the previous
 * algorithm produced (or the default one) and swaps palettes, neutrals and shadows.
 */
export const darkAlgorithm: MappingAlgorithm = (seed, mapToken) => ({
  ...(mapToken ?? defaultAlgorithm(seed)),
  ...genColorMapToken(seed, (color) =>
    generatePalette(color, { theme: 'dark', backgroundColor: DARK_BG }),
  ),
  ...darkNeutralTokens,
  ...darkShadowTokens,
});
