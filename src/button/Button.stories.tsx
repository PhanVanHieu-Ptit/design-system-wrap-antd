import type { Meta, StoryObj } from '@storybook/react';
import { SearchOutlined } from '../icons';
import { Button } from './Button';

const meta = {
  title: 'General/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    type: { control: 'select', options: ['primary', 'default', 'dashed', 'link', 'text'] },
    size: { control: 'inline-radio', options: ['large', 'middle', 'small'] },
    shape: { control: 'inline-radio', options: ['default', 'round', 'circle'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
  marginBottom: 16,
} as const;

export const Playground: Story = { args: { type: 'primary' } };

export const Types: Story = {
  render: () => (
    <div style={row}>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="text">Text</Button>
      <Button type="link">Link</Button>
    </div>
  ),
};

export const Danger: Story = {
  render: () => (
    <div style={row}>
      <Button type="primary" danger>
        Primary
      </Button>
      <Button danger>Default</Button>
      <Button type="dashed" danger>
        Dashed
      </Button>
      <Button type="text" danger>
        Text
      </Button>
      <Button type="link" danger>
        Link
      </Button>
    </div>
  ),
};

export const Ghost: Story = {
  render: () => (
    <div style={{ ...row, background: 'rgb(190, 200, 200)', padding: 16 }}>
      <Button type="primary" ghost>
        Primary
      </Button>
      <Button ghost>Default</Button>
      <Button type="dashed" ghost>
        Dashed
      </Button>
      <Button type="primary" danger ghost>
        Danger
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Button type="primary" size="large">
        Large
      </Button>
      <Button type="primary">Middle</Button>
      <Button type="primary" size="small">
        Small
      </Button>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div style={row}>
      <Button type="primary" icon={<SearchOutlined />}>
        Search
      </Button>
      <Button icon={<SearchOutlined />} iconPosition="end">
        Search
      </Button>
      <Button type="primary" shape="circle" icon={<SearchOutlined />} aria-label="search" />
      <Button shape="round" icon={<SearchOutlined />}>
        Round
      </Button>
      <Button icon={<SearchOutlined />} aria-label="search" />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={row}>
      <Button type="primary" loading>
        Loading
      </Button>
      <Button loading>Default</Button>
      <Button type="primary" loading={{ delay: 1000 }}>
        Delay 1s
      </Button>
      <Button shape="circle" loading aria-label="loading" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <Button type="primary" disabled>
        Primary
      </Button>
      <Button disabled>Default</Button>
      <Button type="dashed" disabled>
        Dashed
      </Button>
      <Button type="text" disabled>
        Text
      </Button>
      <Button type="link" disabled>
        Link
      </Button>
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Button type="primary" block style={{ marginBottom: 8 }}>
        Block primary
      </Button>
      <Button block>Block default</Button>
    </div>
  ),
};
