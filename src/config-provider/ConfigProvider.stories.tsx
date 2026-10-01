import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { darkAlgorithm, defaultAlgorithm, generatePalette } from '../theme';
import { ConfigProvider } from './index';

const meta = {
  title: 'Config/ConfigProvider',
  component: ConfigProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ConfigProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NestedThemes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <ConfigProvider theme={{ token: { colorPrimary: '#13c2c2', borderRadius: 2 } }}>
        <Button type="primary">Cyan, square</Button>
        <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
          <div style={{ background: '#141414', padding: 16, marginTop: 8 }}>
            <Button type="primary">Nested dark (inherits cyan)</Button>
          </div>
        </ConfigProvider>
      </ConfigProvider>
    </div>
  ),
};

export const DarkModeSwitch: Story = {
  render: function Render() {
    const [dark, setDark] = useState(false);
    return (
      <ConfigProvider theme={{ algorithm: dark ? darkAlgorithm : defaultAlgorithm }}>
        <div
          style={{
            background: 'var(--hui-color-bg-container)',
            color: 'var(--hui-color-text)',
            padding: 24,
            display: 'grid',
            gap: 12,
            maxWidth: 360,
            boxShadow: 'var(--hui-box-shadow-dropdown)',
            borderRadius: 'var(--hui-border-radius-lg)',
          }}
        >
          <Button type="primary" onClick={() => setDark(!dark)}>
            Switch to {dark ? 'light' : 'dark'}
          </Button>
          <Input placeholder="Themed input" allowClear />
        </div>
      </ConfigProvider>
    );
  },
};

export const Palette: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['default', 'dark'] as const).map((theme) => (
        <div key={theme}>
          <div style={{ marginBottom: 4 }}>{theme}</div>
          <div style={{ display: 'flex' }}>
            {generatePalette('#1677ff', { theme }).map((c, i) => (
              <div
                key={c}
                title={c}
                style={{
                  background: c,
                  width: 56,
                  height: 40,
                  color: i < 5 ? '#000' : '#fff',
                  fontSize: 11,
                  padding: 4,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
