import type { ComponentType, HTMLAttributes, ReactNode, SVGAttributes } from 'react';
import { forwardRef } from 'react';
import { classNames } from '../_util/classNames';
import styles from './Icon.module.css';

export type IconTheme = 'outlined' | 'filled' | 'twotone';

export type CustomIconSvgProps = SVGAttributes<SVGSVGElement>;

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Render this component as the `<svg>` (full control). */
  component?: ComponentType<CustomIconSvgProps>;
  /** SVG inner nodes (`<path/>`, `<circle/>`, ...). Wrapped in an `<svg viewBox>` for you. */
  children?: ReactNode;
  viewBox?: string;
  /** Rotate by N degrees. */
  rotate?: number;
  /** Continuous rotation, e.g. for loading indicators. */
  spin?: boolean;
}

/**
 * Base icon wrapper. It owns the box (`<span role="img">`), sizing via `1em`, color via
 * `currentColor`, spin and rotate. Concrete icons are produced by `createIcon`.
 *
 * Icons are decorative by default (`aria-hidden`); pass `aria-label` to expose one.
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  {
    component: Component,
    children,
    viewBox = '0 0 24 24',
    rotate,
    spin,
    className,
    style,
    ...rest
  },
  ref,
) {
  const svgProps: CustomIconSvgProps = {
    width: '1em',
    height: '1em',
    fill: 'currentColor',
    viewBox,
    focusable: 'false',
    'aria-hidden': true,
  };
  const labelled = rest['aria-label'] !== undefined;

  return (
    <span
      role="img"
      aria-hidden={labelled ? undefined : true}
      {...rest}
      ref={ref}
      className={classNames(styles['icon'], spin && styles['icon-spin'], className)}
      style={rotate ? { ...style, transform: `rotate(${rotate}deg)` } : style}
    >
      {Component ? <Component {...svgProps} /> : <svg {...svgProps}>{children}</svg>}
    </span>
  );
});

Icon.displayName = 'Icon';
