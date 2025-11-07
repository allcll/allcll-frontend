import type { Meta, StoryObj } from '@storybook/react-vite';

import InfoChip from './infoChip';

type InfoChipProps = React.ComponentProps<typeof InfoChip>;

const meta = {
  title: 'AllcllUI/InfoChip',
  component: InfoChip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['success', 'warning', 'danger'],
    },
    children: { control: { type: 'text' } },
  },
  args: {
    variant: 'success',
    children: '여석 100',
  },
} satisfies Meta<typeof InfoChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ variant, ...args }) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <h6 className="text-gray-800">Success</h6>
        <InfoChip variant="success" {...args} />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-800">Warning</h6>
        <InfoChip variant="warning" {...args} />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-800">Danger</h6>
        <InfoChip variant="danger" {...args} />
      </li>
    </ul>
  ),

  argTypes: {
    variant: { control: false },
  },
};

export const Playground: Story = {
  args: {
    variant: 'success',
    children: '여석 100',
  },
};

const createInfoChipStory = (variant: InfoChipProps['variant']): Story => ({
  args: { variant, children: '여석 100' },
  argTypes: { variant: { control: false } },
});

export const Success: Story = createInfoChipStory('success');
export const Warning: Story = createInfoChipStory('warning');
export const Danger: Story = createInfoChipStory('danger');
