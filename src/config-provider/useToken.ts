import type { AliasToken } from '../theme';
import { useConfig } from './context';

/** Read the resolved design token (JS side) — useful for canvas/charts or inline styles. */
export function useToken(): { token: AliasToken; isDark: boolean } {
  const { token, isDark } = useConfig();
  return { token, isDark };
}
