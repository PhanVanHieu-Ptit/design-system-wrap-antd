import type { KeyboardEvent, MouseEvent } from 'react';
import { forwardRef, useMemo, useRef } from 'react';
import { classNames } from '../_util/classNames';
import { composeRef } from '../_util/composeRef';
import { Button } from '../button/Button';
import { useConfig } from '../config-provider/context';
import { LoadingOutlined } from '../icons/asn/LoadingOutlined';
import { SearchOutlined } from '../icons/asn/SearchOutlined';
import { InternalInput } from './Input';
import styles from './Input.module.css';
import type { SearchProps } from './types';

/**
 * `Input.Search` — Enter (or the search affordance) calls `onSearch(value)`.
 * Without `enterButton` the affordance is an icon inside the field; with it, a primary Button
 * is attached to the field's right edge.
 */
export const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  {
    enterButton = false,
    loading = false,
    onSearch,
    onPressEnter,
    size: customSize,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const { componentSize } = useConfig();
  const size = customSize ?? componentSize ?? 'middle';
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => composeRef<HTMLInputElement>(ref, inputRef), [ref]);

  const search = (event: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLElement>) => {
    if (loading || disabled) return;
    onSearch?.(inputRef.current?.value ?? '', event, { source: 'input' });
  };

  const hasButton = !!enterButton;
  const icon = loading ? <LoadingOutlined spin /> : <SearchOutlined />;

  const field = (
    <InternalInput
      {...rest}
      ref={mergedRef}
      size={size}
      disabled={disabled}
      className={classNames(hasButton && styles['input-search-field'], !hasButton && className)}
      onClear={() => onSearch?.('', undefined, { source: 'clear' })}
      onPressEnter={(event) => {
        search(event as KeyboardEvent<HTMLInputElement>);
        onPressEnter?.(event);
      }}
      suffix={
        hasButton ? undefined : (
          <button
            type="button"
            className={styles['input-search-icon']}
            aria-label="Search"
            disabled={disabled}
            tabIndex={-1}
            onMouseDown={(event) => event.preventDefault()}
            onClick={search}
          >
            {icon}
          </button>
        )
      }
    />
  );

  if (!hasButton) return field;

  return (
    <span className={classNames(styles['input-search'], className)}>
      {field}
      <Button
        type="primary"
        size={size}
        disabled={disabled}
        loading={loading}
        icon={enterButton === true ? <SearchOutlined /> : undefined}
        className={styles['input-search-button']}
        aria-label={enterButton === true ? 'Search' : undefined}
        onClick={search}
      >
        {enterButton === true ? undefined : enterButton}
      </Button>
    </span>
  );
});

Search.displayName = 'Input.Search';
