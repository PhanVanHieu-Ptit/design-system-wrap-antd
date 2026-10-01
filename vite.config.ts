/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Shared Vite config — used by Vitest and Storybook.
 * The library build lives in `vite.lib.config.ts` and extends this file.
 *
 * CSS Modules emit deterministic, human-readable class names (`hui-btn-primary`) so that
 * consumers can still target them for overrides, just like `.ant-btn-primary` in AntD.
 * Component-local class names are prefixed by convention (`.btn-*`, `.input-*`) to avoid collisions.
 */
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: 'hui-[local]',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: { include: /\.css$/, modules: { classNameStrategy: 'scoped' } },
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { provider: 'v8', include: ['src/**'], exclude: ['src/**/*.stories.tsx'] },
  },
});
