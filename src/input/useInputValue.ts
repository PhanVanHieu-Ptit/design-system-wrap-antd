import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import { useMergedState } from '../_util/useMergedState';
import { toStringValue } from './utils';

interface Options<E extends HTMLInputElement | HTMLTextAreaElement> {
  value?: unknown;
  defaultValue?: unknown;
  onChange?: ((event: ChangeEvent<E>) => void) | undefined;
}

/**
 * Shared value handling for Input and TextArea. The field is *always* controlled internally
 * (so the clear button and counter know the current value) but still honors a `value` prop.
 */
export function useInputValue<E extends HTMLInputElement | HTMLTextAreaElement>({
  value,
  defaultValue,
  onChange,
}: Options<E>) {
  const [innerValue, setInnerValue] = useMergedState<string>(
    toStringValue(defaultValue),
    value === undefined ? undefined : toStringValue(value),
  );

  const handleChange = useCallback(
    (event: ChangeEvent<E>) => {
      setInnerValue(event.target.value);
      onChange?.(event);
    },
    [onChange, setInnerValue],
  );

  return { value: innerValue, handleChange };
}
