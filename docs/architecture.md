# Architecture

## Goals

1. Look and behave like Ant Design v5 (tokens, palette math, spacing, motion).
2. No CSS-in-JS runtime: theming must not cost renders, work with SSR, and tree-shake.
3. One source of truth for design decisions: tokens.

## Token pipeline

```
 user token ──┐
              ├─► Seed ──► algorithm(s) ──► Map ──► Alias ──► user overrides win ──► final token
 default seed ┘                (light|dark)
```

| Layer     | Question it answers               | Example keys                                                                                | Where                                                      |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Seed**  | What did the designer decide?     | `colorPrimary`, `fontSize`, `borderRadius`, `sizeUnit`                                      | `theme/interface/seed.ts`                                  |
| **Map**   | What does that imply? (gradients) | `colorPrimary1..10`, `colorPrimaryHover`, `sizeXXS..XXL`, `borderRadiusSM`, `boxShadowCard` | `theme/interface/map.ts`, `theme/themes/*`                 |
| **Alias** | What do components call it?       | `colorLink`, `colorTextPlaceholder`, `controlOutline`, `colorBgContainerDisabled`           | `theme/interface/alias.ts`, `theme/utils/genAliasToken.ts` |

Components read **alias** tokens only (through CSS variables), so a redesign re-points an alias
without touching component code.

- `generatePalette(color, { theme, backgroundColor })` — HSV ramp: 5 tints, the base, 4 shades; hue
  shifts a little per step. The dark variant blends each step into `#141414` with a fixed opacity map.
  Pure function, no dependencies.
- Algorithms are `(seed, previousMap?) => MapToken`. `darkAlgorithm` is a _color-only overlay_, so
  `[defaultAlgorithm, darkAlgorithm]`, or a future `compactAlgorithm`, composes left to right.
- `getDesignToken(config)` is pure and framework-free, usable in build scripts, tests and SSR.

## From tokens to pixels

```
getDesignToken ─► tokenToCssVars ─► { '--hui-color-primary': '#1677ff', … }
                                       │
        ConfigProvider wrapper (display: contents) ◄┘   or  :root  with theme.global
                                       │
                CSS Modules:  background: var(--hui-color-primary)
```

- `src/styles/default-vars.css` (generated, guarded by a test) defines the light tokens on `:root`,
  so components work with no provider. `ConfigProvider` only overrides variables for its subtree.
- Light/dark is a different set of variable values. Nothing re-renders and no CSS is regenerated.
- Nested providers merge tokens; a child's algorithm replaces its parent's.

## Component styling conventions

- One CSS Module per component, class names `hui-<local>` (see `generateScopedName` in
  `vite.config.ts`): deterministic and overridable, like `.ant-btn-primary`. Local names carry the
  component prefix (`.btn-*`, `.input-*`) so they cannot collide.
- Variants never branch in JS. A variant class redefines a few component-scoped custom properties
  (`--btn-bg`, `--btn-border-hover`, …) and the base rule consumes them. Combinations such as
  `dashed + danger + ghost` need no special case.
- Colors, sizes, radii, shadows and durations come from `--hui-*` variables, never literals
  (a few intentional exceptions: the neutral `0 2px 0 rgba(0,0,0,.02)` button shadow).
- Motion honors `prefers-reduced-motion`.

## Behavior conventions

- Compound components follow the AntD shape: `Input.Password`, `Input.Search`, `Input.TextArea`.
- Controlled/uncontrolled via `useMergedState`; fields are always controlled internally so the
  clear button and counter know the value, yet a `value` prop still wins.
- The clear button empties the field through the browser (native setter + real `input` event), so
  `onChange` is a real event for controlled, uncontrolled and form-library consumers.
- Wave: `useWave` appends a self-removing `<span>` on click (pure DOM, no render per click).
- Accessibility: icons are decorative unless labelled; icon-only controls need `aria-label`; the
  empty clear button is `visibility: hidden` (removed from the a11y tree) but keeps layout.

## Packaging

- `vite.lib.config.ts` uses `preserveModules`, so output mirrors `src/`: importing `Button` pulls no
  `Input` code (verified: a Button-only bundle is ~16 kB and contains no Input modules).
- `vite-plugin-lib-inject-css` adds `import './x.css'` to each module that owns styles
  (`"sideEffects": ["**/*.css"]` keeps them from being dropped).
- Outputs: `dist/es/*.js`, `dist/cjs/*.cjs`, `.d.ts` in both. React and `clsx` are externals.

## Known limitations (Phase 1)

- Class prefix is fixed (`hui`); there is no runtime `prefixCls` because CSS Modules are compiled.
- Overlay components (Tooltip, Modal, …) that portal outside the provider will need either
  `theme.global` or a portal container that carries the variables (planned with the first overlay).
- Token values passed to `theme.token` for derived colors (`controlOutline`, …) must be valid CSS
  colors; seed colors must be hex.
- No `Form` integration yet (`status` is a plain prop).
