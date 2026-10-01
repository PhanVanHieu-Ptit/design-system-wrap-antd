import { useCallback, useState } from 'react';

/**
 * Controlled/uncontrolled state in one hook. When `value` is provided it wins; otherwise the
 * hook owns the state, seeded with `defaultValue`.
 */
export function useMergedState<T>(defaultValue: T, value?: T): [T, (next: T) => void, boolean] {
  const [inner, setInner] = useState<T>(value !== undefined ? value : defaultValue);
  const controlled = value !== undefined;
  const setValue = useCallback((next: T) => setInner(next), []);
  return [controlled ? value : inner, setValue, controlled];
}
