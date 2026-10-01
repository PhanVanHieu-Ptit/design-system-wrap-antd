import type { MappingAlgorithm } from '../../interface';
import { generatePalette } from '../../utils/generatePalette';
import {
  genFontMapToken,
  genHeightMapToken,
  genMotionMapToken,
  genSizeMapToken,
  genStyleMapToken,
} from '../shared/genCommonMapToken';
import {
  genColorMapToken,
  lightNeutralTokens,
  lightShadowTokens,
} from '../shared/genColorMapToken';

/** Light theme: seed -> map. */
export const defaultAlgorithm: MappingAlgorithm = (seed, mapToken) => ({
  ...mapToken,
  ...seed,
  ...genColorMapToken(seed, (color) => generatePalette(color)),
  ...lightNeutralTokens,
  ...lightShadowTokens,
  ...genSizeMapToken(seed),
  ...genFontMapToken(seed),
  ...genStyleMapToken(seed),
  ...genHeightMapToken(seed),
  ...genMotionMapToken(seed),
});
