/**
 * Generates `src/styles/default-vars.css`: the light-theme tokens as CSS variables on `:root`.
 *
 * Why: components read `var(--hui-*)`. Without this file they would render unstyled unless
 * wrapped in <ConfigProvider>. With it, components work out of the box (like AntD) and
 * ConfigProvider only needs to *override* variables for its subtree.
 *
 * Run via `pnpm gen:vars` (also part of `pnpm build`). A unit test guards against drift.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { renderDefaultVarsCss } from '../src/theme/utils/defaultVarsCss';

const out = resolve(import.meta.dirname, '../src/styles/default-vars.css');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, renderDefaultVarsCss());
console.log(`wrote ${out}`);
