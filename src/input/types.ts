import type {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import type { SizeType } from '../config-provider/context';

export type InputStatus = 'error' | 'warning';
export type InputSize = SizeType;
export type InputVariant = 'outlined' | 'filled' | 'borderless';
export type AllowClear = boolean | { clearIcon?: ReactNode };

interface CommonInputProps {
  /** Validation state: recolors the border and focus ring. */
  status?: InputStatus;
  /** Falls back to `ConfigProvider componentSize`, then `middle`. */
  size?: InputSize;
  variant?: InputVariant;
  /** Show a clear button when there is a value. */
  allowClear?: AllowClear;
  /** Fired when Enter is pressed (not while an IME is composing). */
  onPressEnter?: (event: KeyboardEvent<HTMLElement>) => void;
  /** Fired after the clear button emptied the field. */
  onClear?: () => void;
}

export interface InputProps
  extends CommonInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Content rendered inside the field, before the text. */
  prefix?: ReactNode;
  /** Content rendered inside the field, after the text (and after the clear button). */
  suffix?: ReactNode;
}

export interface PasswordProps extends Omit<InputProps, 'type' | 'suffix'> {
  /** Show the eye toggle. Pass an object to control visibility. @default true */
  visibilityToggle?: boolean | { visible?: boolean; onVisibleChange?: (visible: boolean) => void };
  iconRender?: (visible: boolean) => ReactNode;
}

export interface SearchProps extends Omit<InputProps, 'suffix'> {
  /** Render a primary button next to the field. `true` = icon button, node = custom label. */
  enterButton?: boolean | ReactNode;
  loading?: boolean;
  onSearch?: (
    value: string,
    event?:
      | ChangeEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>,
    info?: { source: 'input' | 'clear' },
  ) => void;
}

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

export interface TextAreaProps
  extends CommonInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Grow with content. Optionally bound the height in rows. */
  autoSize?: boolean | AutoSizeType;
  /** Show a character counter. Pass an object to format it. */
  showCount?:
    | boolean
    | { formatter?: (info: { value: string; count: number; maxLength?: number }) => ReactNode };
}
