import type { KeyboardEvent } from 'react';
import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import { classNames } from '../_util/classNames';
import { composeRef } from '../_util/composeRef';
import { useConfig } from '../config-provider/context';
import { ClearIcon } from './ClearIcon';
import { handleEnter } from './Input';
import styles from './Input.module.css';
import type { AutoSizeType, TextAreaProps } from './types';
import { useInputValue } from './useInputValue';
import { clearElement, countChars } from './utils';

/** Resize a textarea to fit its content, bounded by optional min/max rows. */
function fitHeight(el: HTMLTextAreaElement, { minRows, maxRows }: AutoSizeType) {
  const cs = getComputedStyle(el);
  const lineHeight = parseFloat(cs.lineHeight) || 22;
  const padding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

  el.style.height = 'auto';
  const content = el.scrollHeight; // includes padding
  const min = minRows ? lineHeight * minRows + padding : 0;
  const max = maxRows ? lineHeight * maxRows + padding : Infinity;
  el.style.height = `${Math.min(Math.max(content, min), max) + border}px`;
  el.style.overflowY = content > max ? 'auto' : 'hidden';
}

/**
 * `Input.TextArea`. Adds auto-sizing, a counter (`showCount`) and the clear button.
 * The wrapper span is only rendered when one of the decorations is on.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    autoSize,
    showCount,
    allowClear,
    status,
    size: customSize,
    variant = 'outlined',
    className,
    style,
    disabled,
    readOnly,
    maxLength,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    onPressEnter,
    onClear,
    rows,
    ...rest
  },
  ref,
) {
  const { componentSize } = useConfig();
  const size = customSize ?? componentSize ?? 'middle';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMemo(() => composeRef<HTMLTextAreaElement>(ref, textareaRef), [ref]);
  const { value: innerValue, handleChange } = useInputValue<HTMLTextAreaElement>({
    value,
    defaultValue,
    onChange,
  });

  const autoSizeConfig = autoSize ? (typeof autoSize === 'object' ? autoSize : {}) : undefined;
  const minRows = autoSizeConfig?.minRows;
  const maxRows = autoSizeConfig?.maxRows;
  useLayoutEffect(() => {
    if (!textareaRef.current || !autoSize) return;
    fitHeight(textareaRef.current, { minRows, maxRows } as AutoSizeType);
  }, [innerValue, autoSize, minRows, maxRows]);

  const shared = classNames(
    size === 'large' && styles['input-lg'],
    size === 'small' && styles['input-sm'],
    variant !== 'outlined' && styles[`input-${variant}`],
    status && styles[`input-status-${status}`],
    disabled && styles['input-disabled'],
  );

  const textareaProps = {
    ...rest,
    ref: mergedRef,
    rows: rows ?? (autoSize ? minRows : undefined) ?? 2,
    maxLength,
    value: innerValue,
    disabled,
    readOnly,
    onChange: handleChange,
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
      handleEnter(event, onPressEnter);
      onKeyDown?.(event);
    },
  };

  const clearable = !!allowClear && !disabled && !readOnly;
  if (!clearable && !showCount) {
    return (
      <textarea
        {...textareaProps}
        className={classNames(styles['input'], styles['textarea'], shared, className)}
        style={style}
      />
    );
  }

  const count = countChars(innerValue);
  const formatter = typeof showCount === 'object' ? showCount.formatter : undefined;
  const countNode = formatter
    ? formatter({ value: innerValue, count, ...(maxLength !== undefined && { maxLength }) })
    : maxLength !== undefined
      ? `${count} / ${maxLength}`
      : count;

  return (
    <span
      className={classNames(
        styles['input-affix-wrapper'],
        styles['textarea-affix-wrapper'],
        showCount && styles['textarea-has-count'],
        shared,
        className,
      )}
      style={style}
    >
      <textarea
        {...textareaProps}
        className={classNames(styles['input-inner'], styles['textarea'])}
      />
      {clearable && (
        <ClearIcon
          className={styles['textarea-clear-icon']}
          visible={innerValue !== ''}
          icon={typeof allowClear === 'object' ? allowClear.clearIcon : undefined}
          onClear={() => {
            if (!textareaRef.current) return;
            clearElement(textareaRef.current);
            onClear?.();
          }}
        />
      )}
      {showCount && <span className={styles['textarea-count']}>{countNode}</span>}
    </span>
  );
});

TextArea.displayName = 'Input.TextArea';
