import { createIcon } from '../createIcon';

export const CheckCircleOutlined = createIcon({
  name: 'CheckCircleOutlined',
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
      <path d="M7.5 12.5l3 3 6-6.5" />
    </g>
  ),
});
