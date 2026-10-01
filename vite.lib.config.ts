import { resolve } from 'node:path';
import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import base from './vite.config';

const external = (id: string) =>
  id === 'react' ||
  id === 'react-dom' ||
  id.startsWith('react/') ||
  id.startsWith('react-dom/') ||
  id === 'clsx';

/**
 * Library build.
 * - `preserveModules` keeps one output file per source module so bundlers can tree-shake at
 *   file granularity (importing `Button` never pulls in `Input`).
 * - `libInjectCss` adds `import './x.css'` to each emitted module so styles travel with the
 *   component that needs them (marked in `sideEffects`).
 * - Two output dirs: ESM (`dist/es`) and CJS (`dist/cjs`), each with `.d.ts`.
 */
export default mergeConfig(
  base,
  defineConfig({
    plugins: [
      libInjectCss(),
      dts({
        tsconfigPath: './tsconfig.build.json',
        entryRoot: 'src',
        outDirs: ['dist/es', 'dist/cjs'],
      }),
    ],
    build: {
      target: 'es2020',
      sourcemap: true,
      cssCodeSplit: true,
      emptyOutDir: true,
      lib: { entry: resolve(import.meta.dirname, 'src/index.ts'), formats: ['es', 'cjs'] },
      rollupOptions: {
        external,
        output: [
          {
            format: 'es',
            dir: 'dist/es',
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js',
            assetFileNames: 'assets/[name][extname]',
          },
          {
            format: 'cjs',
            dir: 'dist/cjs',
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].cjs',
            assetFileNames: 'assets/[name][extname]',
          },
        ],
      },
    },
  }),
);
