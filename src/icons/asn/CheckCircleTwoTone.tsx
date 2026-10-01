import { createIcon } from '../createIcon';

export const CheckCircleTwoTone = createIcon({
  name: 'CheckCircleTwoTone',
  theme: 'twotone',
  render: ({ primary, secondary }) => (
    <>
      <circle cx="12" cy="12" r="10" fill={secondary} />
      <g
        fill="none"
        stroke={primary}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9.5" />
        <path d="M7.5 12.5l3 3 6-6.5" />
      </g>
    </>
  ),
});
