import { createIcon } from '../createIcon';

export const ExclamationCircleOutlined = createIcon({
  name: 'ExclamationCircleOutlined',
  theme: 'outlined',
  render: () => (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5.5M12 16.4v.1" />
    </g>
  ),
});
