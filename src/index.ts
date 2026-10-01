/**
 * @hieu/ui public API.
 *
 * Named exports only (no default / barrel side effects) so bundlers can tree-shake. Each
 * component lives in its own module; the library build preserves that file structure.
 */
export { ConfigProvider, ConfigContext, useConfig, useToken } from './config-provider';
export type {
  ConfigContextValue,
  ConfigProviderProps,
  DirectionType,
  SizeType,
} from './config-provider';

export { Button } from './button';
export type { ButtonHTMLType, ButtonProps, ButtonShape, ButtonSize, ButtonType } from './button';

export { Input } from './input';
export type {
  AllowClear,
  AutoSizeType,
  InputProps,
  InputSize,
  InputStatus,
  InputVariant,
  PasswordProps,
  SearchProps,
  TextAreaProps,
} from './input';

export * from './icons';

export {
  theme,
  defaultAlgorithm,
  darkAlgorithm,
  defaultSeedToken,
  generatePalette,
  getDesignToken,
  tokenToCssVars,
} from './theme';
export type {
  AliasToken,
  MapToken,
  MappingAlgorithm,
  SeedToken,
  ThemeConfig,
  GeneratePaletteOptions,
} from './theme';
