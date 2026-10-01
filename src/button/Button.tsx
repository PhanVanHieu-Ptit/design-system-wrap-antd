import type { MouseEvent, ReactNode, Ref } from 'react';
import { Children, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '../_util/classNames';
import { composeRef } from '../_util/composeRef';
import { useWave } from '../_util/wave';
import { useConfig } from '../config-provider/context';
import { LoadingOutlined } from '../icons/asn/LoadingOutlined';
import styles from './Button.module.css';
import type { ButtonProps } from './types';

/** Bare text needs its own element so the flex `gap` spaces it from the icon. */
function wrapText(children: ReactNode): ReactNode {
  return Children.map(children, (child) =>
    typeof child === 'string' || typeof child === 'number' ? <span>{child}</span> : child,
  );
}

const hasContent = (children: ReactNode) => Children.toArray(children).length > 0 || children === 0;

/**
 * Button.
 *
 * Structure: one component, five visual `type`s and orthogonal modifiers (`danger`, `ghost`,
 * `loading`, ...). The styles never branch in JS — each modifier is a class, and each class only
 * redefines a few `--btn-*` custom properties, which the base rule consumes. That keeps the CSS
 * small and makes every combination (e.g. dashed + danger + ghost) work without a special case.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    type = 'default',
    danger = false,
    ghost = false,
    loading = false,
    icon,
    iconPosition = 'start',
    size: customSize,
    shape = 'default',
    block = false,
    htmlType = 'button',
    href,
    className,
    children,
    disabled = false,
    onClick,
    ...rest
  },
  ref,
) {
  const { componentSize } = useConfig();
  const size = customSize ?? componentSize ?? 'middle';

  // ---- loading (with optional delay so quick operations do not flash a spinner)
  const isLoading = !!loading;
  const delay = typeof loading === 'object' ? (loading.delay ?? 0) : 0;
  const [delayElapsed, setDelayElapsed] = useState(false);
  useEffect(() => {
    if (!isLoading || delay <= 0) return;
    const timer = setTimeout(() => setDelayElapsed(true), delay);
    return () => {
      clearTimeout(timer);
      setDelayElapsed(false);
    };
  }, [isLoading, delay]);
  const mergedLoading = isLoading && (delay <= 0 || delayElapsed);

  // ---- wave
  const innerRef = useRef<HTMLElement>(null);
  const mergedRef = useMemo(() => composeRef<HTMLElement>(ref, innerRef), [ref]);
  useWave(innerRef, disabled || mergedLoading || type === 'link' || type === 'text');

  // ---- content
  const hasLabel = hasContent(children);
  const iconOnly = !hasLabel && (!!icon || mergedLoading);
  const iconNode = mergedLoading ? (
    <LoadingOutlined spin />
  ) : icon ? (
    <span className={styles['btn-icon']}>{icon}</span>
  ) : null;
  const content = (
    <>
      {iconPosition === 'start' && iconNode}
      {wrapText(children)}
      {iconPosition === 'end' && iconNode}
    </>
  );

  const classes = classNames(
    styles['btn'],
    styles[`btn-${type}`],
    size === 'large' && styles['btn-lg'],
    size === 'small' && styles['btn-sm'],
    shape !== 'default' && styles[`btn-${shape}`],
    danger && styles['btn-dangerous'],
    ghost && styles['btn-background-ghost'],
    mergedLoading && styles['btn-loading'],
    iconOnly && styles['btn-icon-only'],
    block && styles['btn-block'],
    href !== undefined && disabled && styles['btn-disabled'],
    className,
  );

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (mergedLoading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  if (href !== undefined) {
    return (
      <a
        {...rest}
        ref={mergedRef as Ref<HTMLAnchorElement>}
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : rest.tabIndex}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...rest}
      ref={mergedRef as Ref<HTMLButtonElement>}
      type={htmlType}
      className={classes}
      disabled={disabled}
      aria-busy={mergedLoading || undefined}
      onClick={handleClick}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';
