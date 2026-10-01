import { createIcon } from '../createIcon';

export const LoadingOutlined = createIcon({
  name: 'LoadingOutlined',
  theme: 'outlined',
  render: () => (
    <path
      d="M12 3a9 9 0 1 0 9 9"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  ),
});
