import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import type { SizeType } from '../config-provider/context';

export type ButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text';
export type ButtonSize = SizeType;
export type ButtonShape = 'default' | 'circle' | 'round';
export type ButtonHTMLType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLElement>, 'type' | 'onClick'> {
  /** Visual variant. @default 'default' */
  type?: ButtonType;
  /** Destructive action; recolors every variant with the error palette. */
  danger?: boolean;
  /** Transparent background, for use on dark or colored surfaces. */
  ghost?: boolean;
  /** Show a spinner and block clicks. `{ delay }` avoids flicker on fast operations. */
  loading?: boolean | { delay?: number };
  icon?: ReactNode;
  /** Where the icon sits relative to the label. @default 'start' */
  iconPosition?: 'start' | 'end';
  /** Falls back to `ConfigProvider componentSize`, then `middle`. */
  size?: ButtonSize;
  shape?: ButtonShape;
  /** Stretch to the container width. */
  block?: boolean;
  /** Native `type` attribute for `<button>`. @default 'button' */
  htmlType?: ButtonHTMLType;
  /** When set, renders an `<a>` instead of a `<button>`. */
  href?: string;
  target?: string;
  rel?: string;
  download?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}
