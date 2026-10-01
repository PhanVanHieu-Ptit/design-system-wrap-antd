import { createIcon } from '../createIcon';

export const CheckCircleFilled = createIcon({
  name: 'CheckCircleFilled',
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
        <path d="M7.5 12.5l3 3 6-6.5" />
      </g>
    </>
  ),
});
