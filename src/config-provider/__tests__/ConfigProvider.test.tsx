import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConfigProvider, useToken } from '..';
import { darkAlgorithm } from '../../theme';
import { Button } from '../../button';

function Probe() {
  const { token, isDark } = useToken();
  return (
    <span data-testid="probe">
      {token.colorPrimary}|{token.colorBgContainer}|{String(isDark)}
    </span>
  );
}

const wrapper = (testId = 'cfg') =>
  document
    .querySelector<HTMLElement>(`[data-testid="${testId}"]`)
    ?.closest('[data-hui-theme]') as HTMLElement;

describe('ConfigProvider', () => {
  it('works without a provider (default tokens)', () => {
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('#1677ff|#ffffff|false');
  });

  it('publishes token overrides as CSS variables', () => {
    render(
      <ConfigProvider theme={{ token: { colorPrimary: '#722ed1', borderRadius: 2 } }}>
        <span data-testid="cfg" />
      </ConfigProvider>,
    );
    const el = wrapper();
    expect(el.style.getPropertyValue('--hui-color-primary')).toBe('#722ed1');
    expect(el.style.getPropertyValue('--hui-border-radius')).toBe('2px');
    // palette is re-derived from the new seed
    expect(el.style.getPropertyValue('--hui-color-primary-hover')).not.toBe('#4096ff');
    expect(el).toHaveAttribute('data-hui-theme', 'light');
  });

  it('switches to dark mode through the algorithm', () => {
    const { rerender } = render(
      <ConfigProvider>
        <span data-testid="cfg" />
      </ConfigProvider>,
    );
    expect(wrapper().style.getPropertyValue('--hui-color-bg-container')).toBe('#ffffff');

    rerender(
      <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
        <span data-testid="cfg" />
      </ConfigProvider>,
    );
    expect(wrapper().style.getPropertyValue('--hui-color-bg-container')).toBe('#141414');
    expect(wrapper()).toHaveAttribute('data-hui-theme', 'dark');
  });

  it('merges nested providers', () => {
    render(
      <ConfigProvider theme={{ token: { colorPrimary: '#52c41a' }, algorithm: darkAlgorithm }}>
        <ConfigProvider theme={{ token: { borderRadius: 0 } }}>
          <span data-testid="cfg" />
          <Probe />
        </ConfigProvider>
      </ConfigProvider>,
    );
    const el = wrapper();
    expect(el.style.getPropertyValue('--hui-border-radius')).toBe('0px'); // child
    expect(el.style.getPropertyValue('--hui-color-primary')).toBe('#52c41a'); // inherited override
    expect(el.style.getPropertyValue('--hui-color-bg-container')).toBe('#141414'); // inherited dark
    expect(screen.getByTestId('probe')).toHaveTextContent('true');
  });

  it('provides componentSize to size-aware components, but props win', () => {
    render(
      <ConfigProvider componentSize="large">
        <Button>a</Button>
        <Button size="small">b</Button>
      </ConfigProvider>,
    );
    expect(screen.getByText('a').closest('button')).toHaveClass('hui-btn-lg');
    expect(screen.getByText('b').closest('button')).toHaveClass('hui-btn-sm');
  });

  it('can write variables to :root with theme.global', () => {
    const { unmount } = render(
      <ConfigProvider theme={{ global: true, token: { colorPrimary: '#eb2f96' } }}>
        <span />
      </ConfigProvider>,
    );
    expect(document.documentElement.style.getPropertyValue('--hui-color-primary')).toBe('#eb2f96');
    unmount();
    expect(document.documentElement.style.getPropertyValue('--hui-color-primary')).toBe('');
  });

  it('sets direction', () => {
    render(
      <ConfigProvider direction="rtl">
        <span data-testid="cfg" />
      </ConfigProvider>,
    );
    expect(wrapper()).toHaveAttribute('dir', 'rtl');
  });
});
