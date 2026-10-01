import type {
  FontMapToken,
  HeightMapToken,
  MotionMapToken,
  SeedToken,
  SizeMapToken,
  StyleMapToken,
} from '../../interface';

/** Everything in the map layer that does not depend on light/dark. */

export function genSizeMapToken({ sizeUnit: u, sizeStep: s }: SeedToken): SizeMapToken {
  return {
    sizeXXS: u * (s - 3), // 4
    sizeXS: u * (s - 2), // 8
    sizeSM: u * (s - 1), // 12
    sizeMD: u * s, // 16
    sizeLG: u * (s + 2), // 24
    sizeXL: u * (s + 4), // 32
    sizeXXL: u * (s + 8), // 48
  };
}

export function genFontMapToken({ fontSize }: SeedToken): FontMapToken {
  const lh = (size: number) => (size + 8) / size;
  return {
    fontSizeSM: fontSize - 2,
    fontSizeLG: fontSize + 2,
    fontSizeXL: fontSize + 6,
    lineHeight: lh(fontSize),
    lineHeightLG: lh(fontSize + 2),
    lineHeightSM: lh(fontSize - 2),
  };
}

export function genStyleMapToken({ borderRadius }: SeedToken): StyleMapToken {
  if (borderRadius <= 0) return { borderRadiusXS: 0, borderRadiusSM: 0, borderRadiusLG: 0 };
  return {
    borderRadiusXS: Math.max(1, Math.round(borderRadius / 3)), // 2
    borderRadiusSM: Math.round((borderRadius * 2) / 3), // 4
    borderRadiusLG: borderRadius + 2, // 8
  };
}

export function genHeightMapToken({ controlHeight }: SeedToken): HeightMapToken {
  return {
    controlHeightSM: Math.round(controlHeight * 0.75), // 24
    controlHeightLG: Math.round(controlHeight * 1.25), // 40
  };
}

export function genMotionMapToken({ motionUnit, motionBase, motion }: SeedToken): MotionMapToken {
  const duration = (n: number) =>
    motion ? `${Number((motionBase + n * motionUnit).toFixed(2))}s` : '0s';
  return {
    motionDurationFast: duration(1), // 0.1s
    motionDurationMid: duration(2), // 0.2s
    motionDurationSlow: duration(3), // 0.3s
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseInOutCirc: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    motionEaseOutCirc: 'cubic-bezier(0.08, 0.82, 0.17, 1)',
  };
}
