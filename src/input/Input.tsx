import type { KeyboardEvent, MouseEvent } from 'react';
import { forwardRef, useMemo, useRef } from 'react';
import { classNames } from '../_util/classNames';
import { composeRef } from '../_util/composeRef';
import { useConfig } from '../config-provider/context';
import { ClearIcon } from './ClearIcon';
import styles from './Input.module.css';
import type { InputProps } from './types';
import { useInputValue } from './useInputValue';
import { clearElement } from './utils';

/** The Enter key handler shared by Input and TextArea (ignores IME composition). */
export function handleEnter<E extends HTMLElement>(
  event: KeyboardEvent<E>,
  onPressEnter?: (event: KeyboardEvent<E>) => void,
) {
  if (event.key === 'Enter' && !event.nativeEvent.isComposing) onPressEnter?.(event);
}

/**
 * Base Input.
 *
 * Like AntD, the DOM stays minimal: a bare `<input>` when there is nothing to decorate, and an
 * "affix wrapper" `<span>` (which owns the border, focus ring and status colors) only when a
 * `prefix`, `suffix` or clear button needs to live next to the text.
 */
export const InternalInput = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    prefix,
    suffix,
    allowClear,
    status,
    size: customSize,
    variant = 'outlined',
    className,
    style,
    disabled,
    readOnly,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    onPressEnter,
    onClear,
    ...rest
  },
  ref,
) {
  const { componentSize } = useConfig();
  const size = customSize ?? componentSize ?? 'middle';
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => composeRef<HTMLInputElement>(ref, inputRef), [ref]);
  const { value: innerValue, handleChange } = useInputValue<HTMLInputElement>({
    value,
    defaultValue,
    onChange,
  });

  const shared = classNames(
    size === 'large' && styles['input-lg'],
    size === 'small' && styles['input-sm'],
    variant !== 'outlined' && styles[`input-${variant}`],
    status && styles[`input-status-${status}`],
    disabled && styles['input-disabled'],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    handleEnter(event, onPressEnter);
    onKeyDown?.(event);
  };

  const inputProps = {
    ...rest,
    ref: mergedRef,
    value: innerValue,
    disabled,
    readOnly,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
  };

  const hasAffix = prefix != null || suffix != null || !!allowClear;
  if (!hasAffix) {
    return (
      <input
        {...inputProps}
        className={classNames(styles['input'], shared, className)}
        style={style}
      />
    );
  }

  const clearable = !!allowClear && !disabled && !readOnly;
  const clearIcon = typeof allowClear === 'object' ? allowClear.clearIcon : undefined;

  // Clicking padding/prefix/suffix should focus the field like clicking the field itself.
  const focusInput = (event: MouseEvent<HTMLSpanElement>) => {
    if (event.target !== inputRef.current) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      className={classNames(styles['input-affix-wrapper'], shared, className)}
      style={style}
      onMouseDown={focusInput}
    >
      {prefix != null && <span className={styles['input-prefix']}>{prefix}</span>}
      <input {...inputProps} className={styles['input-inner']} />
      {(clearable || suffix != null) && (
        <span className={styles['input-suffix']}>
          {clearable && (
            <ClearIcon
              visible={innerValue !== ''}
              icon={clearIcon}
              onClear={() => {
                if (!inputRef.current) return;
                clearElement(inputRef.current);
                onClear?.();
              }}
            />
          )}
          {suffix}
        </span>
      )}
    </span>
  );
});

InternalInput.displayName = 'Input';
