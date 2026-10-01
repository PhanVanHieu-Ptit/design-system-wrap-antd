import type { MapToken } from './map';

/**
 * Layer 3 — Alias Tokens.
 *
 * Semantic, component-facing names ("the color of a link", "the placeholder color"). Components
 * only ever read alias tokens, so a redesign can re-point an alias without touching components.
 * Consumers can override any alias token through `ConfigProvider theme.token`.
 */
export interface AliasToken extends MapToken {
  colorLink: string;
  colorLinkHover: string;
  colorLinkActive: string;

  colorWhite: string;
  colorTextPlaceholder: string;
  colorTextDisabled: string;
  colorTextHeading: string;
  colorBgContainerDisabled: string;
  colorBgTextHover: string;
  colorBgTextActive: string;
  colorBgMask: string;
  colorBorderDisabled: string;

  /** Focus ring colors */
  controlOutline: string;
  colorErrorOutline: string;
  colorWarningOutline: string;
  controlOutlineWidth: number;

  /** Horizontal padding inside controls */
  controlPaddingHorizontal: number;
  controlPaddingHorizontalSM: number;

  zIndexPopup: number;
}
