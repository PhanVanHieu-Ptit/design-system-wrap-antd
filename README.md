# @hieu/ui

An enterprise React UI library in the **Ant Design v5 visual language**, built on a two-layer
design-token system, CSS variables and CSS Modules. Zero CSS-in-JS runtime, SSR-safe, tree-shakable.

- React 18+, TypeScript (strict)
- Tokens: **Seed → Map → Alias**, with `generatePalette` (10-step light/dark palettes)
- Light/dark switching by swapping CSS variables (no re-render, no style re-injection)
- Phase 1 components: `ConfigProvider`, `Button` (with click wave), `Input` (`Password`, `Search`, `TextArea`), `Icon` wrappers (Outlined / Filled / TwoTone)
- ESM + CJS builds with per-module output, Storybook, Vitest + Testing Library

## Install

```bash
pnpm add @hieu/ui react react-dom   # or npm i / yarn add
```

Styles are bundled per component (each module imports its own CSS), so there is no stylesheet to
import by hand. Your bundler needs to handle `.css` imports (Vite, webpack, Next.js, … all do).

> **Jest / Node-only environments:** map CSS to a stub, e.g.
> `moduleNameMapper: { '\\.css$': '<rootDir>/test/style-mock.js' }`. Vitest handles CSS out of the box.

## Quick start

```tsx
import { Button, ConfigProvider, Input, darkAlgorithm } from '@hieu/ui';

export function App() {
  const [dark, setDark] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: dark ? darkAlgorithm : undefined, // default = light
        token: { colorPrimary: '#722ed1', borderRadius: 8 }, // override seed (or any) tokens
      }}
      componentSize="middle"
    >
      <Input.Search placeholder="Search" onSearch={console.log} allowClear />
      <Input.Password placeholder="Password" status="error" />
      <Button type="primary" onClick={() => setDark(!dark)}>
        Toggle theme
      </Button>
    </ConfigProvider>
  );
}
```

Components work **without** a `ConfigProvider` (default light tokens are provided on `:root`);
the provider only overrides variables for its subtree. Providers nest and merge.

## Components

### ConfigProvider

| Prop              | Type                                     | Notes                                                          |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `theme.token`     | `Partial<AliasToken>`                    | Seed overrides re-derive palettes; other keys win last.        |
| `theme.algorithm` | `MappingAlgorithm \| MappingAlgorithm[]` | `defaultAlgorithm` (light) or `darkAlgorithm`; arrays compose. |
| `theme.global`    | `boolean`                                | Write CSS variables on `:root` instead of a wrapper element.   |
| `componentSize`   | `'small' \| 'middle' \| 'large'`         | Default size for Button / Input. Component props still win.    |
| `direction`       | `'ltr' \| 'rtl'`                         | Sets `dir` on the wrapper.                                     |

Hooks: `useToken()` → `{ token, isDark }`, `useConfig()`.

### Button

`type`: `primary | default | dashed | link | text` · `danger` · `ghost` · `loading` (`boolean | { delay }`) ·
`disabled` · `icon` / `iconPosition` · `size` · `shape` (`default | round | circle`) · `block` ·
`href` (renders `<a>`) · `htmlType`. Click wave is automatic (skipped when disabled/loading, for
`link`/`text`, and under `prefers-reduced-motion`).

### Input

`Input`, `Input.Password`, `Input.Search`, `Input.TextArea` — `prefix`, `suffix`, `allowClear`,
`status` (`'error' | 'warning'`), `size`, `variant` (`outlined | filled | borderless`), `onPressEnter`.
`Password`: `visibilityToggle`, `iconRender`. `Search`: `enterButton`, `loading`, `onSearch`.
`TextArea`: `autoSize`, `showCount`, `maxLength`.

### Icons

`Icon` is the base wrapper (`component` or SVG `children`, `spin`, `rotate`). `createIcon` builds
Outlined / Filled / TwoTone icons (`twoToneColor`); each icon is its own module for tree-shaking.

## Theming at a glance

```ts
import { getDesignToken, generatePalette, darkAlgorithm } from '@hieu/ui';

generatePalette('#1677ff');
// ['#e6f4ff','#bae0ff','#91caff','#69b1ff','#4096ff','#1677ff','#0958d9','#003eb3','#002c8c','#001d66']

const token = getDesignToken({ algorithm: darkAlgorithm }); // pure, no React
```

Read tokens in CSS with `var(--hui-color-primary)`, `var(--hui-size-md)`, `var(--hui-box-shadow-dropdown)`, …
See [docs/theming.md](docs/theming.md) and [docs/architecture.md](docs/architecture.md).

## Development

```bash
pnpm install
pnpm dev            # Storybook on :6006 (toolbar: light/dark + brand color)
pnpm test           # Vitest + Testing Library
pnpm typecheck      # tsc --noEmit (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes)
pnpm lint
pnpm build          # regenerates default CSS vars, then builds dist/es + dist/cjs + .d.ts
pnpm gen:vars       # regenerate src/styles/default-vars.css after changing tokens
```

Releases use [Changesets](https://github.com/changesets/changesets): `pnpm changeset`, then `pnpm release`.

## Project layout

```
.
├─ .github/workflows/ci.yml        lint + typecheck + test + build
├─ .storybook/                     main.ts, preview.tsx (ConfigProvider decorator, theme/brand toolbar)
├─ .changeset/                     versioning
├─ docs/                           architecture.md, theming.md
├─ scripts/gen-default-vars.ts     tokens -> src/styles/default-vars.css
├─ vite.config.ts                  shared: React, CSS Modules naming, Vitest
├─ vite.lib.config.ts              library build (preserveModules, ESM+CJS, d.ts, CSS inject)
└─ src/
   ├─ index.ts                     public API (named exports only)
   ├─ _util/                       classNames, composeRef, useMergedState, warning, wave/
   ├─ styles/default-vars.css      GENERATED light tokens on :root
   ├─ theme/                       framework-free token engine
   │  ├─ interface/                SeedToken, MapToken, AliasToken, ThemeConfig
   │  ├─ themes/                   seed, default (light) + dark algorithms, shared generators
   │  └─ utils/                    generatePalette, color, cssVar, getDesignToken, genAliasToken
   ├─ config-provider/             ConfigProvider, context, useToken
   ├─ icons/                       Icon, createIcon, asn/* (one file per icon)
   ├─ button/                      Button, types, CSS Module, tests, stories
   └─ input/                       Input, Password, Search, TextArea, ClearIcon, hooks, CSS Module
```
