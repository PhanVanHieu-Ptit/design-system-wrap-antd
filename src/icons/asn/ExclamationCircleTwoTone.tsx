import { createIcon } from '../createIcon';

export const ExclamationCircleTwoTone = createIcon({
  name: 'ExclamationCircleTwoTone',
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
        <path d="M12 7.5v5.5M12 16.4v.1" />
      </g>
    </>
  ),
});
