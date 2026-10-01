import type { MouseEventHandler, ReactNode } from 'react';
import { classNames } from '../_util/classNames';
import { CloseCircleFilled } from '../icons/asn/CloseCircleFilled';
import styles from './Input.module.css';

export interface ClearIconProps {
  visible: boolean;
  icon?: ReactNode;
  onClear: MouseEventHandler<HTMLButtonElement>;
  className?: string | undefined;
}

/**
 * Clear button. It stays in the layout when hidden so the field does not jump as you type.
 * `mousedown` is prevented so clicking it does not blur the input.
 */
export function ClearIcon({ visible, icon, onClear, className }: ClearIconProps) {
  return (
    <button
      type="button"
      aria-label="Clear"
      tabIndex={-1}
      className={classNames(
        styles['input-clear-icon'],
        !visible && styles['input-clear-icon-hidden'],
        className,
      )}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClear}
    >
      {icon ?? <CloseCircleFilled />}
    </button>
  );
}
