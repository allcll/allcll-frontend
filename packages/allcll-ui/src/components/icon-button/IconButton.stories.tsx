import type { Meta, StoryObj } from '@storybook/react-vite';

import IconButton from './IconButton';
import FilterSvg from '@/assets/filtering.svg?react';

type IconButtonProps = React.ComponentProps<typeof IconButton>;

const meta = {
  title: 'AllcllUI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['contain', 'plain'],
    },
    icon: { control: { type: 'text' } },
  },
  args: {
    variant: 'plain',
    icon: <FilterSvg className="w-4 h-4 text-gray-400" />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ variant, icon, ...args }) => (
    <div className="flex flex-wrap gap-4">
      <div>
        <h2>Contain</h2>
        <IconButton variant="contain" icon={icon} {...args} />
      </div>
      <div>
        <h2>Plain</h2>
        <IconButton variant="plain" icon={icon} {...args} />
      </div>
    </div>
  ),
  args: {
    variant: 'plain',
    label: 'Filter',
    icon: <FilterSvg className="w-4 h-4 text-gray-400" />,
  },
  argTypes: {
    variant: { control: false },
  },
  tags: ['autodocs'],
};

export const Playground: Story = {
  args: {
    label: 'Filter',
    icon: <FilterSvg className="w-4 h-4 text-gray-400" />,
    variant: 'plain',
  },
};

const createButtonStory = (variant: IconButtonProps['variant']): Story => ({
  args: { variant, label: 'Filter' },
  argTypes: { variant: { control: false } },
});

export const Contain: Story = createButtonStory('contain');
export const Plain: Story = createButtonStory('plain');
