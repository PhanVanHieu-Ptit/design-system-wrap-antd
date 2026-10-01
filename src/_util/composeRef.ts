import type { MutableRefObject, Ref, RefCallback } from 'react';

/** Merge several refs (callback or object) into one callback ref. */
export function composeRef<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as MutableRefObject<T | null>).current = node;
    }
  };
}
