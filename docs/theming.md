# Theming guide

## Brand color

```tsx
<ConfigProvider theme={{ token: { colorPrimary: '#722ed1' } }}>…</ConfigProvider>
```

`colorPrimary` is a **seed**: the 10-step palette, hover/active shades, focus outline and link
color are re-derived from it. Seeds: `colorPrimary/Success/Warning/Error/Info`, `fontFamily`,
`fontSize`, `borderRadius`, `lineWidth`, `sizeUnit`, `sizeStep`, `controlHeight`, `motion*`.

## Dark mode

```tsx
import { darkAlgorithm } from '@hieu/ui';
<ConfigProvider theme={{ algorithm: darkAlgorithm }}>…</ConfigProvider>;
```

Dark swaps palettes (blended into `#141414`), neutrals and shadows. Sizes, radii and motion are
unchanged. Compose with other algorithms: `algorithm: [defaultAlgorithm, darkAlgorithm]`.

## Overriding a single token

Any alias/map key can be overridden; it is applied after the algorithm runs:

```tsx
<ConfigProvider theme={{ token: { colorBgContainer: '#fafafa', boxShadowDropdown: 'none' } }} />
```

Note: overriding a _seed_ in dark mode keeps your exact value for that key (as in AntD).

## Spacing, type, radius, shadows (defaults)

| Token                                  | Values                                                            |
| -------------------------------------- | ----------------------------------------------------------------- |
| `sizeXXS … sizeXXL`                    | 4 · 8 · 12 · 16 · 24 · 32 · 48 px (`sizeUnit` = 4)                |
| `fontSize` / `lineHeight`              | 14px / 1.5714 (SM 12, LG 16, XL 20)                               |
| `borderRadiusXS / SM / (base) / LG`    | 2 · 4 · 6 · 8 px                                                  |
| `controlHeightSM / (base) / LG`        | 24 · 32 · 40 px                                                   |
| `boxShadowCard` / `Dropdown` / `Popup` | resting · floating · blocking elevation                           |
| `motionDurationFast/Mid/Slow`          | 0.1s · 0.2s · 0.3s, easing `cubic-bezier(0.645, 0.045, 0.355, 1)` |

## Using tokens in your own CSS

Inside any `ConfigProvider` (or anywhere, with the defaults on `:root`):

```css
.card {
  background: var(--hui-color-bg-container);
  border-radius: var(--hui-border-radius-lg);
  box-shadow: var(--hui-box-shadow-card);
  padding: var(--hui-size-md);
}
```

Variable name = `--hui-` + kebab-case token key (`colorPrimaryBgHover` → `--hui-color-primary-bg-hover`).
Lengths get `px`; unitless values (`lineHeight`, `motionUnit`) stay raw.

## Using tokens in JS

```tsx
const { token, isDark } = useToken(); // inside a provider
const token = getDesignToken({ algorithm: darkAlgorithm }); // anywhere
```

## Regenerating defaults

After changing seeds or algorithms run `pnpm gen:vars` (also part of `pnpm build`). A unit test
fails if `src/styles/default-vars.css` drifts from the token engine.
