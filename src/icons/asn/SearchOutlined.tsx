import { createIcon } from '../createIcon';

export const SearchOutlined = createIcon({
  name: 'SearchOutlined',
  theme: 'outlined',
  render: () => (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20.5 20.5L16 16" />
    </g>
  ),
});
