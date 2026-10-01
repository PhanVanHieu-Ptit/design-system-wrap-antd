import { describe, expect, it } from 'vitest';
import { darkAlgorithm, defaultAlgorithm, getDesignToken } from '..';

describe('token pipeline', () => {
  it('maps seed -> map -> alias with AntD defaults', () => {
    const token = getDesignToken();
    expect(token.colorPrimary).toBe('#1677ff');
    expect(token.colorSuccess).toBe('#52c41a');
    expect(token.colorWarning).toBe('#faad14');
    expect(token.colorError).toBe('#ff4d4f');
    expect(token.colorInfo).toBe('#1677ff');
    expect(token.fontSize).toBe(14);
    expect(token.lineHeight).toBeCloseTo(1.5714, 4);
    expect(token.borderRadius).toBe(6);
    expect([token.borderRadiusXS, token.borderRadiusSM, token.borderRadiusLG]).toEqual([2, 4, 8]);
  });

  it('builds the 4px-based size scale', () => {
    const t = getDesignToken();
    expect([t.sizeXXS, t.sizeXS, t.sizeSM, t.sizeMD, t.sizeLG, t.sizeXL, t.sizeXXL]).toEqual([
      4, 8, 12, 16, 24, 32, 48,
    ]);
    expect([t.controlHeightSM, t.controlHeight, t.controlHeightLG]).toEqual([24, 32, 40]);
  });

  it('exposes three elevation levels and motion tokens', () => {
    const t = getDesignToken();
    expect(new Set([t.boxShadowCard, t.boxShadowDropdown, t.boxShadowPopup]).size).toBe(3);
    expect([t.motionDurationFast, t.motionDurationMid, t.motionDurationSlow]).toEqual([
      '0.1s',
      '0.2s',
      '0.3s',
    ]);
  });

  it('derives named palette views', () => {
    const t = getDesignToken();
    expect(t.colorPrimaryBg).toBe(t.colorPrimary1);
    expect(t.colorPrimaryHover).toBe(t.colorPrimary5);
    expect(t.colorPrimaryActive).toBe(t.colorPrimary7);
    expect(t.colorPrimaryHover).toBe('#4096ff');
    expect(t.colorPrimaryActive).toBe('#0958d9');
  });

  it('re-derives the palette when a seed is overridden', () => {
    const t = getDesignToken({ token: { colorPrimary: '#722ed1' } });
    expect(t.colorPrimary).toBe('#722ed1');
    expect(t.colorPrimaryBg).not.toBe('#e6f4ff');
  });

  it('applies non-seed overrides last', () => {
    const t = getDesignToken({ token: { colorBgContainer: '#fafafa' } });
    expect(t.colorBgContainer).toBe('#fafafa');
  });

  it('dark algorithm swaps palettes and neutrals but keeps sizes', () => {
    const light = getDesignToken();
    const dark = getDesignToken({ algorithm: darkAlgorithm });
    expect(dark.colorBgContainer).toBe('#141414');
    expect(dark.colorPrimary).toBe('#1668dc');
    expect(dark.colorText).toContain('255');
    expect(dark.sizeMD).toBe(light.sizeMD);
    expect(dark.borderRadius).toBe(light.borderRadius);
  });

  it('composes algorithms left to right', () => {
    const t = getDesignToken({ algorithm: [defaultAlgorithm, darkAlgorithm] });
    expect(t.colorBgContainer).toBe('#141414');
  });

  it('turns motion off with the motion seed', () => {
    expect(getDesignToken({ token: { motion: false } }).motionDurationMid).toBe('0s');
  });
});
