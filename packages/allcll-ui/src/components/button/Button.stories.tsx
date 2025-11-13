import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';
import HomeSvg from '@/assets/house.svg?react';

type ButtonProps = React.ComponentProps<typeof Button>;

const meta = {
  title: 'AllcllUI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'danger', 'text', 'outlined', 'ghost'],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    children: {
      control: { type: 'text' },
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    children: 'Button',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ size }) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <Button variant="primary" size={size}>
          Primary
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <Button variant="secondary" size={size}>
          Secondary
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <Button variant="danger" size={size}>
          Danger
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <Button variant="text" size={size}>
          Text
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <Button variant="outlined" size={size}>
          Outlined
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <Button variant="ghost" size={size}>
          Ghost
        </Button>
      </li>
    </ul>
  ),
  argTypes: {
    variant: { control: false },
  },
};

export const Sizes: Story = {
  render: ({ variant }) => (
    <div className="flex flex-wrap gap-4">
      <div>
        <Button variant={variant} size="small">
          Small
        </Button>
      </div>
      <div>
        <Button variant={variant} size="medium">
          Medium
        </Button>
      </div>
      <div>
        <Button variant={variant} size="large">
          Large
        </Button>
      </div>
    </div>
  ),
  argTypes: {
    size: { control: false },
  },
};

export const WithIcon: Story = {
  render: ({ variant }) => (
    <div className="flex flex-wrap gap-4">
      <div>
        <Button variant={variant} size="small">
          <HomeSvg className="w-5 h-5" />
          LeftIcon
        </Button>
      </div>
      <div>
        <Button variant={variant} size="medium">
          RightIcon
          <HomeSvg className="w-5 h-5" />
        </Button>
      </div>
    </div>
  ),
  argTypes: {
    size: { control: false },
  },
};

export const Playground: Story = {};

const createButtonStory = (variant: ButtonProps['variant']): Story => ({
  args: { variant },
  argTypes: { variant: { control: false } },
});

export const Primary: Story = createButtonStory('primary');
export const Secondary: Story = createButtonStory('secondary');
export const Danger: Story = createButtonStory('danger');
export const Text: Story = createButtonStory('text');
export const Outlined: Story = createButtonStory('outlined');
export const Ghost: Story = createButtonStory('ghost');
