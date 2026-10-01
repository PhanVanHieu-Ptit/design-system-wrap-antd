import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '..';

describe('Input', () => {
  it('renders a bare input when nothing is decorated', () => {
    const { container } = render(<Input placeholder="name" />);
    expect(container.firstChild).toBe(screen.getByPlaceholderText('name'));
    expect(container.firstChild).toHaveClass('hui-input');
  });

  it('forwards refs and supports uncontrolled typing', async () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(<Input ref={ref} defaultValue="a" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'bc');
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current?.value).toBe('abc');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('is controllable', async () => {
    function Controlled() {
      const [v, setV] = useState('x');
      return <Input value={v} onChange={(e) => setV(e.target.value.toUpperCase())} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole('textbox'), 'yz');
    expect(screen.getByRole('textbox')).toHaveValue('XYZ');
  });

  it('does not change when controlled value is not updated', async () => {
    render(<Input value="fixed" onChange={() => {}} />);
    await userEvent.type(screen.getByRole('textbox'), 'zz');
    expect(screen.getByRole('textbox')).toHaveValue('fixed');
  });

  it('renders prefix and suffix inside an affix wrapper', () => {
    const { container } = render(
      <Input prefix={<i data-testid="p" />} suffix={<i data-testid="s" />} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('hui-input-affix-wrapper');
    expect(wrapper).toContainElement(screen.getByTestId('p'));
    expect(wrapper).toContainElement(screen.getByTestId('s'));
  });

  it('focuses the input when the prefix is clicked', async () => {
    render(<Input prefix={<span data-testid="p">@</span>} />);
    await userEvent.click(screen.getByTestId('p'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  describe('allowClear', () => {
    it('clears an uncontrolled field and fires onChange / onClear', async () => {
      const onChange = vi.fn();
      const onClear = vi.fn();
      render(<Input allowClear defaultValue="hello" onChange={onChange} onClear={onClear} />);
      const clear = screen.getByRole('button', { name: 'Clear' });
      expect(clear).not.toHaveClass('hui-input-clear-icon-hidden');

      await userEvent.click(clear);
      expect(screen.getByRole('textbox')).toHaveValue('');
      expect(screen.getByRole('textbox')).toHaveFocus();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0]?.[0].target.value).toBe('');
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText('Clear')).toHaveClass('hui-input-clear-icon-hidden');
    });

    it('clears a controlled field through onChange', async () => {
      function Controlled() {
        const [v, setV] = useState('abc');
        return <Input allowClear value={v} onChange={(e) => setV(e.target.value)} />;
      }
      render(<Controlled />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('is hidden when empty and absent when disabled or readOnly', () => {
      const { rerender } = render(<Input allowClear />);
      // hidden from the accessibility tree while empty
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
      expect(screen.getByLabelText('Clear')).toHaveClass('hui-input-clear-icon-hidden');
      rerender(<Input allowClear disabled defaultValue="x" />);
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
      rerender(<Input allowClear readOnly defaultValue="x" />);
      expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    });
  });

  describe('status, size, variant', () => {
    it.each(['error', 'warning'] as const)('applies status=%s', (status) => {
      render(<Input status={status} />);
      expect(screen.getByRole('textbox')).toHaveClass(`hui-input-status-${status}`);
    });

    it('applies status to the affix wrapper, not the inner input', () => {
      const { container } = render(<Input status="error" prefix="$" />);
      expect(container.firstChild).toHaveClass('hui-input-status-error');
      expect(screen.getByRole('textbox')).not.toHaveClass('hui-input-status-error');
    });

    it('applies size and variant', () => {
      render(<Input size="large" variant="filled" />);
      expect(screen.getByRole('textbox')).toHaveClass('hui-input-lg', 'hui-input-filled');
    });

    it('applies disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
      expect(screen.getByRole('textbox')).toHaveClass('hui-input-disabled');
    });
  });

  it('fires onPressEnter', async () => {
    const onPressEnter = vi.fn();
    render(<Input onPressEnter={onPressEnter} />);
    await userEvent.type(screen.getByRole('textbox'), 'a{Enter}');
    expect(onPressEnter).toHaveBeenCalledTimes(1);
  });

  describe('Input.Password', () => {
    it('toggles visibility', async () => {
      render(<Input.Password defaultValue="secret" />);
      const input = document.querySelector('input') as HTMLInputElement;
      expect(input).toHaveAttribute('type', 'password');
      const toggle = screen.getByRole('button', { name: 'Show password' });
      await userEvent.click(toggle);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
    });

    it('supports controlled visibility and hiding the toggle', async () => {
      const onVisibleChange = vi.fn();
      const { rerender } = render(
        <Input.Password visibilityToggle={{ visible: false, onVisibleChange }} />,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(onVisibleChange).toHaveBeenCalledWith(true);
      expect(document.querySelector('input')).toHaveAttribute('type', 'password'); // parent did not update

      rerender(<Input.Password visibilityToggle={false} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not toggle when disabled', () => {
      render(<Input.Password disabled />);
      expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
    });
  });

  describe('Input.Search', () => {
    it('calls onSearch on Enter and on icon click', async () => {
      const onSearch = vi.fn();
      render(<Input.Search onSearch={onSearch} />);
      await userEvent.type(screen.getByRole('textbox'), 'abc{Enter}');
      expect(onSearch).toHaveBeenLastCalledWith('abc', expect.anything(), { source: 'input' });
      await userEvent.click(screen.getByRole('button', { name: 'Search' }));
      expect(onSearch).toHaveBeenCalledTimes(2);
    });

    it('renders an enter button', async () => {
      const onSearch = vi.fn();
      render(<Input.Search enterButton="Go" defaultValue="q" onSearch={onSearch} />);
      await userEvent.click(screen.getByRole('button', { name: 'Go' }));
      expect(onSearch).toHaveBeenCalledWith('q', expect.anything(), { source: 'input' });
      expect(screen.getByRole('button', { name: 'Go' })).toHaveClass('hui-btn-primary');
    });

    it('icon enter button gets an accessible name', () => {
      render(<Input.Search enterButton />);
      expect(screen.getByRole('button', { name: 'Search' })).toHaveClass('hui-btn-icon-only');
    });

    it('does not search while loading or disabled', async () => {
      const onSearch = vi.fn();
      const { rerender } = render(<Input.Search loading onSearch={onSearch} />);
      await userEvent.type(screen.getByRole('textbox'), 'a{Enter}');
      expect(onSearch).not.toHaveBeenCalled();
      rerender(<Input.Search disabled onSearch={onSearch} />);
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));
      expect(onSearch).not.toHaveBeenCalled();
    });

    it('reports clear as a search with source "clear"', async () => {
      const onSearch = vi.fn();
      render(<Input.Search allowClear defaultValue="x" onSearch={onSearch} />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(onSearch).toHaveBeenCalledWith('', undefined, { source: 'clear' });
    });
  });

  describe('Input.TextArea', () => {
    it('renders a textarea', () => {
      render(<Input.TextArea placeholder="msg" rows={4} />);
      const ta = screen.getByPlaceholderText('msg');
      expect(ta.tagName).toBe('TEXTAREA');
      expect(ta).toHaveAttribute('rows', '4');
      expect(ta).toHaveClass('hui-input', 'hui-textarea');
    });

    it('shows a counter, with maxLength and custom formatter', async () => {
      const { rerender } = render(<Input.TextArea showCount maxLength={10} />);
      expect(screen.getByText('0 / 10')).toBeInTheDocument();
      await userEvent.type(screen.getByRole('textbox'), 'abc');
      expect(screen.getByText('3 / 10')).toBeInTheDocument();

      rerender(
        <Input.TextArea
          showCount={{ formatter: ({ count, maxLength }) => `${count} of ${maxLength}` }}
          maxLength={10}
        />,
      );
      expect(screen.getByText('3 of 10')).toBeInTheDocument();
    });

    it('counts code points, not UTF-16 units', async () => {
      render(<Input.TextArea showCount defaultValue="a😀" />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('clears', async () => {
      render(<Input.TextArea allowClear defaultValue="hello" />);
      await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('applies status and sizes the wrapper', () => {
      const { container } = render(<Input.TextArea status="warning" showCount />);
      expect(container.firstChild).toHaveClass(
        'hui-input-status-warning',
        'hui-textarea-affix-wrapper',
      );
    });

    it('autoSize sets rows from minRows and a height', () => {
      render(<Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} defaultValue="x" />);
      const ta = screen.getByRole('textbox') as HTMLTextAreaElement;
      expect(ta).toHaveAttribute('rows', '3');
      expect(ta.style.height).toMatch(/px$/);
    });

    it('fires onPressEnter', async () => {
      const onPressEnter = vi.fn();
      render(<Input.TextArea onPressEnter={onPressEnter} />);
      await userEvent.type(screen.getByRole('textbox'), '{Enter}');
      expect(onPressEnter).toHaveBeenCalledTimes(1);
    });
  });
});
