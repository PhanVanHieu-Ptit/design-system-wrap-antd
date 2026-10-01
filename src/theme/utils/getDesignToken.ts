import type { AliasToken, MapToken, MappingAlgorithm, SeedToken, ThemeConfig } from '../interface';
import { defaultAlgorithm } from '../themes/default';
import { defaultSeedToken } from '../themes/seed';
import { genAliasToken } from './genAliasToken';

export const toArray = <T>(value: T | T[] | undefined): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/**
 * Run the whole pipeline:
 *
 *   user token ─┐
 *               ├─► Seed ──algorithm(s)──► Map ──► Alias ──► (user overrides win) ──► final
 *   default seed┘
 *
 * Pure function: same config in, same token out. No React, safe for SSR and build scripts.
 */
export function getDesignToken(config: ThemeConfig = {}): AliasToken {
  const override = config.token ?? {};
  const seed = { ...defaultSeedToken, ...override } as SeedToken;

  const algorithms: MappingAlgorithm[] = toArray(config.algorithm);
  if (algorithms.length === 0) algorithms.push(defaultAlgorithm);

  const map = algorithms.reduce<MapToken | undefined>(
    (acc, algorithm) => algorithm(seed, acc),
    undefined,
  ) as MapToken;

  return { ...genAliasToken(map), ...override };
}
