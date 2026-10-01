import { createIcon } from '../createIcon';

export const EyeInvisibleOutlined = createIcon({
  name: 'EyeInvisibleOutlined',
  theme: 'outlined',
  render: () => (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M4 4l16 16" />
    </g>
  ),
});
