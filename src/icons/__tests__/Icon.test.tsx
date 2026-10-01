import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  Icon,
  LoadingOutlined,
} from '..';

describe('Icon', () => {
  it('renders an svg sized by font-size and colored by currentColor', () => {
    const { container } = render(<CheckCircleOutlined />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '1em');
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(container.firstChild).toHaveAttribute('data-icon', 'CheckCircleOutlined');
  });

  it('is decorative by default and labelled when aria-label is given', () => {
    const { container, rerender } = render(<CheckCircleFilled />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    rerender(<CheckCircleFilled aria-label="ok" />);
    expect(container.firstChild).not.toHaveAttribute('aria-hidden');
  });

  it('supports spin and rotate', () => {
    const { container } = render(<LoadingOutlined spin rotate={90} />);
    expect(container.firstChild).toHaveClass('hui-icon-spin');
    expect(container.firstChild).toHaveStyle({ transform: 'rotate(90deg)' });
  });

  it('two-tone icons take a single color or a pair', () => {
    const { container, rerender } = render(<CheckCircleTwoTone twoToneColor="#52c41a" />);
    expect(container.querySelector('circle')).toHaveAttribute('fill', '#f6ffed');
    rerender(<CheckCircleTwoTone twoToneColor={['#111111', '#eeeeee']} />);
    expect(container.querySelector('circle')).toHaveAttribute('fill', '#eeeeee');
  });

  it('wraps custom children and components', () => {
    const { container } = render(
      <Icon viewBox="0 0 10 10">
        <rect width="10" height="10" />
      </Icon>,
    );
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 10 10');
    const Custom = (props: React.SVGAttributes<SVGSVGElement>) => <svg data-custom {...props} />;
    const { container: c2 } = render(<Icon component={Custom} />);
    expect(c2.querySelector('[data-custom]')).toBeInTheDocument();
  });
});
