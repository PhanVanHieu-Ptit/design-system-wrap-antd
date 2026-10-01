// Defaults for every component, so they render correctly even without a <ConfigProvider>.
import '../styles/default-vars.css';

import { createContext, useContext } from 'react';
import type { AliasToken, ThemeConfig } from '../theme';
import { getDesignToken } from '../theme';

export type SizeType = 'small' | 'middle' | 'large';
export type DirectionType = 'ltr' | 'rtl';

export interface ConfigContextValue {
  /** Merged theme config (parent + own). Child providers merge on top of this. */
  theme: ThemeConfig;
  /** Fully resolved token. */
  token: AliasToken;
  isDark: boolean;
  componentSize?: SizeType;
  direction?: DirectionType;
}

let defaultValue: ConfigContextValue | undefined;

/** Lazily computed so importing the library has no startup cost. */
export function getDefaultConfig(): ConfigContextValue {
  defaultValue ??= { theme: {}, token: getDesignToken(), isDark: false };
  return defaultValue;
}

export const ConfigContext = createContext<ConfigContextValue | null>(null);

export function useConfig(): ConfigContextValue {
  return useContext(ConfigContext) ?? getDefaultConfig();
}
