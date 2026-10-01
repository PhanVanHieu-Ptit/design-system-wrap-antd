import type { Decorator, Preview } from '@storybook/react';
import { ConfigProvider, darkAlgorithm, defaultAlgorithm } from '../src';

/** Every story renders inside <ConfigProvider>; the toolbar flips light/dark and brand color. */
const withTheme: Decorator = (Story, context) => {
  const dark = context.globals['theme'] === 'dark';
  const colorPrimary = context.globals['brand'] as string;
  return (
    <ConfigProvider
      theme={{ algorithm: dark ? darkAlgorithm : defaultAlgorithm, token: { colorPrimary } }}
    >
      <div
        style={{
          padding: 24,
          minHeight: '100vh',
          boxSizing: 'border-box',
          background: dark ? '#000' : '#f5f5f5',
        }}
      >
        <Story />
      </div>
    </ConfigProvider>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: { layout: 'fullscreen', controls: { expanded: true } },
  initialGlobals: { theme: 'light', brand: '#1677ff' },
  globalTypes: {
    theme: {
      description: 'Light / dark algorithm',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Primary seed color',
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: '#1677ff', title: 'Blue (default)' },
          { value: '#722ed1', title: 'Purple' },
          { value: '#13c2c2', title: 'Cyan' },
          { value: '#eb2f96', title: 'Magenta' },
          { value: '#fa8c16', title: 'Orange' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
