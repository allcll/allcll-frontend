import type { Meta, StoryObj } from '@storybook/react-vite';

import Badge from './Badge';

type BadgeProps = React.ComponentProps<typeof Badge>;

const meta = {
  title: 'AllcllUI/Badge',
  component: Badge,
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
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ variant, ...args }) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <h6 className="text-gray-800">Success</h6>
        <Badge variant="success" {...args} />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-800">Warning</h6>
        <Badge variant="warning" {...args} />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-800">Danger</h6>
        <Badge variant="danger" {...args} />
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

const createBadgeStory = (variant: BadgeProps['variant']): Story => ({
  args: { variant, children: '여석 100' },
  argTypes: { variant: { control: false } },
});

export const Success: Story = createBadgeStory('success');
export const Warning: Story = createBadgeStory('warning');
export const Danger: Story = createBadgeStory('danger');
