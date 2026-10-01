import { darkAlgorithm } from './themes/dark';
import { defaultAlgorithm } from './themes/default';
import { generatePalette } from './utils/generatePalette';
import { getDesignToken } from './utils/getDesignToken';

export type { AliasToken, MapToken, MappingAlgorithm, SeedToken, ThemeConfig } from './interface';
export { defaultSeedToken } from './themes/seed';
export { darkAlgorithm } from './themes/dark';
export { defaultAlgorithm } from './themes/default';
export { generatePalette } from './utils/generatePalette';
export type { GeneratePaletteOptions } from './utils/generatePalette';
export { getDesignToken, toArray } from './utils/getDesignToken';
export {
  CSS_VAR_PREFIX,
  cssVarName,
  renderCssVarBlock,
  toKebabCase,
  tokenToCssVars,
} from './utils/cssVar';

/** AntD-style namespace: `theme.darkAlgorithm`, `theme.getDesignToken()`. */
export const theme = { defaultAlgorithm, darkAlgorithm, getDesignToken, generatePalette };
