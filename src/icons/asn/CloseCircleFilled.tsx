import { createIcon } from '../createIcon';

export const CloseCircleFilled = createIcon({
  name: 'CloseCircleFilled',
  theme: 'filled',
  render: () => (
    // evenodd cuts the "x" out of the disc so it shows whatever is behind the icon
    <path
      fillRule="evenodd"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM7.3 8.7l1.4-1.4L12 10.6l3.3-3.3 1.4 1.4L13.4 12l3.3 3.3-1.4 1.4L12 13.4l-3.3 3.3-1.4-1.4L10.6 12z"
    />
  ),
});
