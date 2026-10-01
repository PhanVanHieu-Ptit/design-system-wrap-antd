import type { AliasToken } from '../interface';

export const CSS_VAR_PREFIX = 'hui';

/** Numeric tokens in these families are lengths and get a `px` unit. Everything else stays raw. */
const PX_KEY_RE =
  /^(size|fontSize|borderRadius|lineWidth|controlHeight|controlPadding|controlOutlineWidth)/;

/**
 * `colorPrimaryBgHover` -> `color-primary-bg-hover`
 * `sizeXXS`             -> `size-xxs`
 * `colorPrimary10`      -> `color-primary-10`
 */
export function toKebabCase(key: string): string {
  return key
    .replace(/([a-z])(\d)/g, '$1-$2')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export const cssVarName = (key: string, prefix: string = CSS_VAR_PREFIX) =>
  `--${prefix}-${toKebabCase(key)}`;

export type CssVars = Record<string, string>;

/**
 * Flatten a resolved token object into CSS custom properties.
 * Booleans and non-primitive values (there are none today) are skipped.
 */
export function tokenToCssVars(
  token: Partial<AliasToken>,
  prefix: string = CSS_VAR_PREFIX,
): CssVars {
  const vars: CssVars = {};
  for (const [key, value] of Object.entries(token)) {
    if (typeof value === 'string') {
      vars[cssVarName(key, prefix)] = value;
    } else if (typeof value === 'number') {
      vars[cssVarName(key, prefix)] = PX_KEY_RE.test(key) ? `${value}px` : String(value);
    }
  }
  return vars;
}

/** Serialize vars to a CSS rule. Used to generate `src/styles/default-vars.css`. */
export function renderCssVarBlock(selector: string, vars: CssVars): string {
  const body = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}\n`;
}
