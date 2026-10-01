import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '..';
import { SearchOutlined } from '../../icons';

describe('Button', () => {
  it('renders a <button type="button"> with the default type', () => {
    render(<Button>Hello</Button>);
    const btn = screen.getByRole('button', { name: 'Hello' });
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveClass('hui-btn', 'hui-btn-default');
  });

  it.each(['primary', 'default', 'dashed', 'link', 'text'] as const)('supports type=%s', (type) => {
    render(<Button type={type}>x</Button>);
    expect(screen.getByRole('button')).toHaveClass(`hui-btn-${type}`);
  });

  it('applies modifiers', () => {
    render(
      <Button type="primary" danger ghost block shape="round" size="large">
        x
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass(
      'hui-btn-dangerous',
      'hui-btn-background-ghost',
      'hui-btn-block',
      'hui-btn-round',
      'hui-btn-lg',
    );
  });

  it('supports htmlType and ref forwarding', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Button htmlType="submit" ref={ref}>
        go
      </Button>,
    );
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveAttribute('type', 'submit');
  });

  it('renders an icon and detects icon-only buttons', () => {
    const { rerender } = render(<Button icon={<SearchOutlined />}>Search</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('hui-btn-icon-only');
    rerender(<Button icon={<SearchOutlined />} aria-label="search" />);
    expect(screen.getByRole('button')).toHaveClass('hui-btn-icon-only');
  });

  it('places the icon at the end', () => {
    render(
      <Button icon={<SearchOutlined data-testid="i" />} iconPosition="end">
        Go
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn.lastElementChild).toContainElement(screen.getByTestId('i'));
  });

  it('calls onClick and blocks it when disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>x</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        x
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  describe('loading', () => {
    it('shows a spinner and swallows clicks', () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );
      const btn = screen.getByRole('button');
      expect(btn).toHaveClass('hui-btn-loading');
      expect(btn).toHaveAttribute('aria-busy', 'true');
      expect(btn.querySelector('.hui-icon-spin')).toBeInTheDocument();
      fireEvent.click(btn);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('honors loading delay', () => {
      vi.useFakeTimers();
      try {
        render(<Button loading={{ delay: 200 }}>Save</Button>);
        expect(screen.getByRole('button')).not.toHaveClass('hui-btn-loading');
        act(() => {
          vi.advanceTimersByTime(200);
        });
        expect(screen.getByRole('button')).toHaveClass('hui-btn-loading');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('link buttons', () => {
    it('renders an anchor when href is set', () => {
      render(
        <Button type="link" href="https://example.com" target="_blank">
          Docs
        </Button>,
      );
      const a = screen.getByRole('link', { name: 'Docs' });
      expect(a).toHaveAttribute('href', 'https://example.com');
      expect(a).toHaveAttribute('target', '_blank');
    });

    it('disables the anchor', () => {
      const onClick = vi.fn();
      render(
        <Button href="/x" disabled onClick={onClick}>
          Docs
        </Button>,
      );
      const a = screen.getByText('Docs').closest('a') as HTMLElement;
      expect(a).toHaveAttribute('aria-disabled', 'true');
      expect(a).not.toHaveAttribute('href');
      fireEvent.click(a);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('wave', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('appends a wave element on click and removes it when the animation ends', () => {
      render(<Button type="primary">x</Button>);
      const btn = screen.getByRole('button');
      fireEvent.click(btn);
      const wave = btn.querySelector('.hui-wave');
      expect(wave).toBeInTheDocument();
      fireEvent.animationEnd(wave as Element);
      expect(btn.querySelector('.hui-wave')).not.toBeInTheDocument();
    });

    it('removes a stuck wave after a timeout and restarts on rapid clicks', () => {
      render(<Button>x</Button>);
      const btn = screen.getByRole('button');
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(btn.querySelectorAll('.hui-wave')).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(1100);
      });
      expect(btn.querySelector('.hui-wave')).not.toBeInTheDocument();
    });

    it.each([
      ['disabled', { disabled: true }],
      ['loading', { loading: true }],
      ['link', { type: 'link' as const }],
      ['text', { type: 'text' as const }],
    ])('does not wave when %s', (_name, props) => {
      render(<Button {...props}>x</Button>);
      const btn = screen.getByRole('button');
      fireEvent.click(btn);
      expect(btn.querySelector('.hui-wave')).not.toBeInTheDocument();
    });
  });
});
