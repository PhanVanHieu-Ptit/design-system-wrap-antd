import type { AliasToken } from './alias';
import type { MapToken } from './map';
import type { SeedToken } from './seed';

export type { SeedToken } from './seed';
export type * from './map';
export type { AliasToken } from './alias';

/**
 * A mapping algorithm turns seed tokens into map tokens. Algorithms compose left to right: each
 * receives the output of the previous one, so `[darkAlgorithm, compactAlgorithm]` works.
 */
export type MappingAlgorithm = (seed: SeedToken, mapToken?: MapToken) => MapToken;

export interface ThemeConfig {
  /** Override any token. Seed overrides re-run the algorithm; other keys are applied last. */
  token?: Partial<AliasToken>;
  /** Defaults to `defaultAlgorithm`. Use `darkAlgorithm` for dark mode. */
  algorithm?: MappingAlgorithm | MappingAlgorithm[];
  /** Write CSS variables to `:root` instead of the ConfigProvider wrapper element. */
  global?: boolean;
}
