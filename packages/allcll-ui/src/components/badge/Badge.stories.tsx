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
      options: ['success', 'warning', 'danger', 'default', 'primary'],
    },
    appearance: {
      control: { type: 'radio' },
      options: ['filled', 'outline'],
    },
    size: {
      control: { type: 'radio' },
      options: ['default', 'small'],
    },
    children: { control: { type: 'text' } },
  },
  args: {
    variant: 'success',
    appearance: 'filled',
    size: 'default',
    children: '여석 100',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: (args) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">success</span>
        <Badge {...args} variant="success" />
      </li>
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">warning</span>
        <Badge {...args} variant="warning" />
      </li>
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">danger</span>
        <Badge {...args} variant="danger" />
      </li>
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">default</span>
        <Badge {...args} variant="default" />
      </li>
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">primary</span>
        <Badge {...args} variant="primary" />
      </li>
    </ul>
  ),
  argTypes: {
    variant: { control: false },
  },
};

export const Appearances: Story = {
  render: (args) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">filled</span>
        <Badge {...args} appearance="filled" />
      </li>
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">outline</span>
        <Badge {...args} appearance="outline" />
      </li>
    </ul>
  ),
  argTypes: {
    appearance: { control: false },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <ul className="flex flex-wrap items-center gap-5">
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">default</span>
        <Badge {...args} size="default" />
      </li>
      <li className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">small</span>
        <Badge {...args} size="small" />
      </li>
    </ul>
  ),
  argTypes: {
    size: { control: false },
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
export const Default: Story = createBadgeStory('default');
export const Primary: Story = createBadgeStory('primary');
