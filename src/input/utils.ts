import type { Ref } from 'react';

/** `undefined` / `null` -> '' so React always sees a controlled string. */
export function toStringValue(value: unknown): string {
  return value === undefined || value === null ? '' : String(value);
}

/**
 * Clear a native field *through the browser*: set the value with the prototype setter (which
 * bypasses React's value tracking) and dispatch a real `input` event. React then fires a genuine
 * `onChange`, so controlled, uncontrolled and form-library users all see the same event flow.
 */
export function clearElement(el: HTMLInputElement | HTMLTextAreaElement): void {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(el, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
}

/** Count by Unicode code points so emoji are not counted twice. */
export const countChars = (value: string) => Array.from(value).length;

export type AnyRef<T> = Ref<T> | undefined;

export const sizeClass = (size: 'small' | 'middle' | 'large') =>
  size === 'large' ? 'input-lg' : size === 'small' ? 'input-sm' : undefined;
