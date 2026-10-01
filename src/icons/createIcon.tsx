import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { generatePalette } from '../theme/utils/generatePalette';
import { isHexColor } from '../theme/utils/color';
import type { IconProps, IconTheme } from './Icon';
import { Icon } from './Icon';

export interface IconBaseProps extends IconProps {
  /** Two-tone icons only. A single color (secondary is derived) or `[primary, secondary]`. */
  twoToneColor?: string | [string, string];
}

export interface IconDefinition {
  name: string;
  theme: IconTheme;
  viewBox?: string;
  /** Draw the SVG children. Two-tone icons receive the resolved color pair. */
  render: (colors: { primary: string; secondary: string }) => ReactNode;
}

const DEFAULT_TWO_TONE = {
  primary: 'var(--hui-color-primary)',
  secondary: 'var(--hui-color-primary-bg)',
};

function resolveTwoTone(color: IconBaseProps['twoToneColor']) {
  if (!color) return DEFAULT_TWO_TONE;
  if (Array.isArray(color)) return { primary: color[0], secondary: color[1] };
  return {
    primary: color,
    secondary: isHexColor(color) ? (generatePalette(color)[0] as string) : color,
  };
}

/**
 * Turn an `IconDefinition` into a React component. One file per icon keeps the icon set
 * tree-shakable: only the icons you import end up in your bundle.
 */
export function createIcon({ name, theme, viewBox = '0 0 24 24', render }: IconDefinition) {
  const Component = forwardRef<HTMLSpanElement, IconBaseProps>(function IconComponent(
    { twoToneColor, ...props },
    ref,
  ) {
    const colors = theme === 'twotone' ? resolveTwoTone(twoToneColor) : DEFAULT_TWO_TONE;
    return (
      <Icon data-icon={name} {...props} ref={ref} viewBox={viewBox}>
        {render(colors)}
      </Icon>
    );
  });
  Component.displayName = name;
  return Component;
}
