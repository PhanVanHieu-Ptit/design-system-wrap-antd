import { forwardRef } from 'react';
import { useMergedState } from '../_util/useMergedState';
import { EyeInvisibleOutlined } from '../icons/asn/EyeInvisibleOutlined';
import { EyeOutlined } from '../icons/asn/EyeOutlined';
import { InternalInput } from './Input';
import styles from './Input.module.css';
import type { PasswordProps } from './types';

const defaultIconRender = (visible: boolean) =>
  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />;

/** `Input.Password` — an Input with a show/hide toggle in its suffix. */
export const Password = forwardRef<HTMLInputElement, PasswordProps>(function Password(
  { visibilityToggle = true, iconRender = defaultIconRender, disabled, ...rest },
  ref,
) {
  const config = typeof visibilityToggle === 'object' ? visibilityToggle : undefined;
  const [visible, setVisible] = useMergedState(false, config?.visible);

  const toggle = () => {
    if (disabled) return;
    setVisible(!visible);
    config?.onVisibleChange?.(!visible);
  };

  return (
    <InternalInput
      {...rest}
      ref={ref}
      disabled={disabled}
      type={visibilityToggle && visible ? 'text' : 'password'}
      suffix={
        visibilityToggle ? (
          <button
            type="button"
            className={styles['input-password-icon']}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            disabled={disabled}
            tabIndex={-1}
            onMouseDown={(event) => event.preventDefault()}
            onClick={toggle}
          >
            {iconRender(visible)}
          </button>
        ) : undefined
      }
    />
  );
});

Password.displayName = 'Input.Password';
