import { describe, expect, it } from 'vitest';
import { generatePalette } from '../utils/generatePalette';

describe('generatePalette', () => {
  it('reproduces the Ant Design blue ramp', () => {
    expect(generatePalette('#1677ff')).toEqual([
      '#e6f4ff',
      '#bae0ff',
      '#91caff',
      '#69b1ff',
      '#4096ff',
      '#1677ff',
      '#0958d9',
      '#003eb3',
      '#002c8c',
      '#001d66',
    ]);
  });

  it('reproduces the Ant Design green ramp', () => {
    expect(generatePalette('#52c41a')[0]).toBe('#f6ffed');
    expect(generatePalette('#52c41a')[9]).toBe('#092b00');
  });

  it('always returns 10 steps with the base color at index 5', () => {
    for (const color of ['#faad14', '#722ed1', '#000000', '#ffffff', '#888']) {
      const palette = generatePalette(color);
      expect(palette).toHaveLength(10);
    }
    expect(generatePalette('#722ed1')[5]).toBe('#722ed1');
  });

  it('generates a dark palette blended into the dark background', () => {
    const dark = generatePalette('#1677ff', { theme: 'dark', backgroundColor: '#141414' });
    expect(dark).toHaveLength(10);
    expect(dark[5]).toBe('#1668dc');
    expect(dark[0]).not.toBe(generatePalette('#1677ff')[0]);
  });

  it('rejects non-hex input with a helpful message', () => {
    expect(() => generatePalette('blue')).toThrow(/Unsupported color/);
  });
});
