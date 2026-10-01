import type { RefObject } from 'react';
import { useEffect } from 'react';
import styles from './style.module.css';

const WAVE_TIMEOUT_MS = 1000;

const TRANSPARENT_RE = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0\s*\)$/;

/** Greys (r === g === b) make a poor wave, so fall back to the primary color for them. */
function isNotGrey(color: string): boolean {
  const match = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(color);
  if (!match) return true;
  return !(match[1] === match[2] && match[2] === match[3]);
}

function isValidWaveColor(color: string | null | undefined): color is string {
  return (
    !!color &&
    color !== 'transparent' &&
    color !== '#fff' &&
    color !== '#ffffff' &&
    color !== 'rgb(255, 255, 255)' &&
    !TRANSPARENT_RE.test(color) &&
    isNotGrey(color)
  );
}

/** Pick the most representative color of the clicked element: border, then background. */
function getWaveColor(el: HTMLElement): string | undefined {
  const cs = getComputedStyle(el);
  return [cs.borderTopColor, cs.backgroundColor].find(isValidWaveColor);
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Attach the click wave to an element. Pure DOM — no state, no re-render per click.
 *
 * Each click appends a `<span class="hui-wave">`, which removes itself when its CSS animation
 * ends (or after a timeout, as a safety net for environments where the event never fires).
 */
export function useWave(ref: RefObject<HTMLElement>, disabled: boolean): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    let wave: HTMLSpanElement | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      clearTimeout(timer);
      wave?.remove();
      wave = null;
    };

    const onClick = () => {
      if (prefersReducedMotion()) return;
      cleanup(); // restart the animation on rapid clicks

      wave = document.createElement('span');
      wave.className = styles['wave'] ?? 'hui-wave';
      const color = getWaveColor(el);
      if (color) wave.style.setProperty('--wave-color', color);
      wave.addEventListener('animationend', cleanup, { once: true });
      el.appendChild(wave);
      timer = setTimeout(cleanup, WAVE_TIMEOUT_MS);
    };

    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('click', onClick);
      cleanup();
    };
  }, [ref, disabled]);
}
