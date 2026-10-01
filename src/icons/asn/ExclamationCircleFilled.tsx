import { createIcon } from '../createIcon';

export const ExclamationCircleFilled = createIcon({
  name: 'ExclamationCircleFilled',
  theme: 'filled',
  render: () => (
    <>
      <circle cx="12" cy="12" r="10" />
      <g
        fill="none"
        stroke="var(--hui-color-bg-container, #fff)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 7.5v5.5M12 16.4v.1" />
      </g>
    </>
  ),
});
