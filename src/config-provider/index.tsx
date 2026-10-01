import type { CSSProperties, ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { classNames } from '../_util/classNames';
import { useIsomorphicLayoutEffect } from '../_util/useIsomorphicLayoutEffect';
import type { MappingAlgorithm, ThemeConfig } from '../theme';
import { darkAlgorithm, getDesignToken, tokenToCssVars, toArray } from '../theme';
import styles from './ConfigProvider.module.css';
import type { ConfigContextValue, DirectionType, SizeType } from './context';
import { ConfigContext, useConfig } from './context';

export interface ConfigProviderProps {
  /** Token overrides + algorithm (light/dark). Nested providers inherit and merge. */
  theme?: ThemeConfig;
  /** Default size for all size-aware components below. Component `size` props still win. */
  componentSize?: SizeType;
  direction?: DirectionType;
  children?: ReactNode;
}

const sameAlgorithms = (a: MappingAlgorithm[], b: MappingAlgorithm[]) =>
  a.length === b.length && a.every((fn, i) => fn === b[i]);

/**
 * Merge a child theme onto its parent. Tokens merge key by key; the algorithm is replaced
 * wholesale (a child that says "dark" means dark, not "light + dark").
 */
function mergeTheme(parent: ThemeConfig, child: ThemeConfig = {}): ThemeConfig {
  const merged: ThemeConfig = { token: { ...parent.token, ...child.token } };
  const algorithm = child.algorithm ?? parent.algorithm;
  if (algorithm !== undefined) merged.algorithm = algorithm;
  if (child.global !== undefined) merged.global = child.global;
  return merged;
}

/**
 * Keep the previous resolved token while the theme is structurally equal, so inline
 * `theme={{ token: {...} }}` objects do not recompute the whole pipeline on every render.
 */
function useResolvedToken(theme: ThemeConfig) {
  const cache = useRef<{
    key: string;
    algorithms: MappingAlgorithm[];
    token: ReturnType<typeof getDesignToken>;
  }>();
  const key = JSON.stringify(theme.token ?? {});
  const algorithms = toArray(theme.algorithm);

  if (
    !cache.current ||
    cache.current.key !== key ||
    !sameAlgorithms(cache.current.algorithms, algorithms)
  ) {
    cache.current = { key, algorithms, token: getDesignToken(theme) };
  }
  return cache.current;
}

/**
 * Outermost component of the library. It
 *  1. runs the token pipeline for `theme`,
 *  2. publishes the result as CSS variables (on a wrapper element, or on `:root` with `global`),
 *  3. exposes it through context for components and `useToken()`.
 *
 * Because styling goes through CSS variables, switching light/dark swaps a handful of
 * custom properties — components do not re-render and no styles are re-injected.
 */
export function ConfigProvider({ theme, componentSize, direction, children }: ConfigProviderProps) {
  const parent = useConfig();
  const mergedTheme = mergeTheme(parent.theme, theme);
  const { token, algorithms } = useResolvedToken(mergedTheme);
  const isDark = algorithms.includes(darkAlgorithm);
  const vars = useMemo(() => tokenToCssVars(token), [token]);
  const global = mergedTheme.global === true;

  useIsomorphicLayoutEffect(() => {
    if (!global) return;
    const root = document.documentElement;
    const names = Object.keys(vars);
    for (const name of names) root.style.setProperty(name, vars[name] as string);
    root.dataset.huiTheme = isDark ? 'dark' : 'light';
    return () => {
      for (const name of names) root.style.removeProperty(name);
      delete root.dataset.huiTheme;
    };
  }, [global, vars, isDark]);

  const value = useMemo<ConfigContextValue>(() => {
    const next: ConfigContextValue = { theme: mergedTheme, token, isDark };
    const size = componentSize ?? parent.componentSize;
    const dir = direction ?? parent.direction;
    if (size) next.componentSize = size;
    if (dir) next.direction = dir;
    return next;
    // `mergedTheme` is rebuilt every render; `token` identity already tracks its content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isDark, componentSize, direction, parent.componentSize, parent.direction]);

  const style = global
    ? undefined
    : ({ ...vars, colorScheme: isDark ? 'dark' : 'light' } as CSSProperties);

  return (
    <ConfigContext.Provider value={value}>
      <div
        className={classNames(styles['config'])}
        style={style}
        data-hui-theme={isDark ? 'dark' : 'light'}
        dir={value.direction}
      >
        {children}
      </div>
    </ConfigContext.Provider>
  );
}

ConfigProvider.displayName = 'ConfigProvider';

export type { ConfigContextValue, DirectionType, SizeType } from './context';
export { ConfigContext, useConfig } from './context';
export { useToken } from './useToken';
