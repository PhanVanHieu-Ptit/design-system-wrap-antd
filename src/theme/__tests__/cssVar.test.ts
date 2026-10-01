import { describe, expect, it } from 'vitest';
import { cssVarName, getDesignToken, tokenToCssVars, toKebabCase } from '..';

describe('css vars', () => {
  it('kebab-cases token keys', () => {
    expect(toKebabCase('colorPrimaryBgHover')).toBe('color-primary-bg-hover');
    expect(toKebabCase('sizeXXS')).toBe('size-xxs');
    expect(toKebabCase('colorPrimary10')).toBe('color-primary-10');
    expect(toKebabCase('fontSizeSM')).toBe('font-size-sm');
    expect(cssVarName('boxShadowCard')).toBe('--hui-box-shadow-card');
  });

  it('adds px to lengths only', () => {
    const vars = tokenToCssVars(getDesignToken());
    expect(vars['--hui-color-primary']).toBe('#1677ff');
    expect(vars['--hui-font-size']).toBe('14px');
    expect(vars['--hui-size-md']).toBe('16px');
    expect(vars['--hui-border-radius']).toBe('6px');
    expect(vars['--hui-control-height']).toBe('32px');
    expect(vars['--hui-line-height']).toBe('1.5714285714285714');
    expect(vars['--hui-motion-unit']).toBe('0.1');
  });

  it('skips booleans', () => {
    expect(tokenToCssVars(getDesignToken())['--hui-motion']).toBeUndefined();
  });
});
