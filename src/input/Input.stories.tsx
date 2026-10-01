import type { Meta, StoryObj } from '@storybook/react';
import { SearchOutlined } from '../icons';
import { Input } from './index';

const meta = {
  title: 'Data Entry/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Basic usage' },
  argTypes: {
    status: { control: 'inline-radio', options: [undefined, 'error', 'warning'] },
    size: { control: 'inline-radio', options: ['large', 'middle', 'small'] },
    variant: { control: 'inline-radio', options: ['outlined', 'filled', 'borderless'] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const stack = { display: 'flex', flexDirection: 'column', gap: 12 } as const;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <Input size="large" placeholder="large" />
      <Input placeholder="middle" />
      <Input size="small" placeholder="small" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={stack}>
      <Input placeholder="outlined" />
      <Input variant="filled" placeholder="filled" />
      <Input variant="borderless" placeholder="borderless" />
    </div>
  ),
};

export const PrefixSuffix: Story = {
  render: () => (
    <div style={stack}>
      <Input prefix={<SearchOutlined />} placeholder="prefix" />
      <Input suffix=".com" placeholder="suffix" />
      <Input prefix="¥" suffix="RMB" placeholder="both" />
    </div>
  ),
};

export const AllowClear: Story = {
  render: () => (
    <div style={stack}>
      <Input allowClear defaultValue="clear me" />
      <Input.TextArea allowClear defaultValue="clear me" />
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={stack}>
      <Input status="error" placeholder="Error" />
      <Input status="warning" placeholder="Warning" />
      <Input status="error" prefix={<SearchOutlined />} placeholder="Error with prefix" />
      <Input status="warning" variant="filled" placeholder="Warning filled" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <Input disabled defaultValue="disabled" />
      <Input disabled prefix={<SearchOutlined />} defaultValue="disabled with prefix" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div style={stack}>
      <Input.Password placeholder="input password" />
      <Input.Password placeholder="no toggle" visibilityToggle={false} />
      <Input.Password allowClear placeholder="with clear" defaultValue="hunter2" status="error" />
    </div>
  ),
};

export const Search: Story = {
  render: () => (
    <div style={stack}>
      <Input.Search placeholder="search" onSearch={(v) => console.log('search', v)} />
      <Input.Search
        placeholder="enter button"
        enterButton
        onSearch={(v) => console.log('search', v)}
      />
      <Input.Search placeholder="custom button" enterButton="Search" size="large" />
      <Input.Search placeholder="loading" loading enterButton />
    </div>
  ),
};

export const TextArea: Story = {
  render: () => (
    <div style={stack}>
      <Input.TextArea rows={3} placeholder="textarea" />
      <Input.TextArea showCount maxLength={100} placeholder="with count" />
      <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="auto size (2–6 rows)" />
      <Input.TextArea status="error" placeholder="error" />
    </div>
  ),
};
