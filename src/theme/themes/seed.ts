import type { SeedToken } from '../interface';

export const defaultSeedToken: SeedToken = {
  colorPrimary: '#1677ff',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorError: '#ff4d4f',
  colorInfo: '#1677ff',

  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontSize: 14,

  borderRadius: 6,
  lineWidth: 1,
  lineType: 'solid',

  sizeUnit: 4,
  sizeStep: 4,

  controlHeight: 32,

  motionUnit: 0.1,
  motionBase: 0,
  motion: true,
};
