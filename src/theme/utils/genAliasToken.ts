import type { AliasToken, MapToken } from '../interface';
import { isHexColor, toRgba } from './color';

/** `toRgba` for hex colors; any other CSS color is passed through untouched. */
const withAlpha = (color: string, alpha: number) =>
  isHexColor(color) ? toRgba(color, alpha) : color;

/** Layer 3: derive semantic alias tokens from a resolved map token. */
export function genAliasToken(map: MapToken): AliasToken {
  return {
    ...map,

    colorLink: map.colorInfo,
    colorLinkHover: map.colorInfoHover,
    colorLinkActive: map.colorInfoActive,

    colorWhite: '#ffffff',
    colorTextPlaceholder: map.colorTextQuaternary,
    colorTextDisabled: map.colorTextQuaternary,
    colorTextHeading: map.colorText,
    colorBgContainerDisabled: map.colorFillTertiary,
    colorBgTextHover: map.colorFillSecondary,
    colorBgTextActive: map.colorFill,
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
    colorBorderDisabled: map.colorBorder,

    controlOutline: withAlpha(map.colorPrimary, 0.1),
    colorErrorOutline: withAlpha(map.colorError, 0.06),
    colorWarningOutline: withAlpha(map.colorWarning, 0.1),
    controlOutlineWidth: 2,

    controlPaddingHorizontal: 12,
    controlPaddingHorizontalSM: 8,

    zIndexPopup: 1050,
  };
}
