import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';
import { HomeIcon } from '../../icons';

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
      options: ['solid', 'outlined', 'text', 'ghost', 'circle'],
    },
    color: {
      control: { type: 'radio' },
      options: ['primary', 'gray', 'danger'],
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
    variant: 'solid',
    color: 'primary',
    size: 'medium',
    disabled: false,
    children: 'Button',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ size, color }) => (
    <ul className="flex flex-wrap gap-5">
      {(['solid', 'outlined', 'text', 'ghost'] as const).map(variant => (
        <li key={variant} className="flex flex-col items-center">
          <Button variant={variant} color={color} size={size}>
            {variant}
          </Button>
        </li>
      ))}
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
          <HomeIcon className="w-5 h-5" />
          LeftIcon
        </Button>
      </div>
      <div>
        <Button variant={variant} size="medium">
          RightIcon
          <HomeIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  ),
  argTypes: {
    size: { control: false },
  },
};

export const Playground: Story = {};

const createButtonStory = (variant: ButtonProps['variant'], color: ButtonProps['color'] = 'primary'): Story => ({
  args: { variant, color },
  argTypes: { variant: { control: false }, color: { control: false } },
});

export const SolidPrimary: Story = createButtonStory('solid');
export const SolidGray: Story = createButtonStory('solid', 'gray');
export const SolidDanger: Story = createButtonStory('solid', 'danger');
export const OutlinedGray: Story = createButtonStory('outlined', 'gray');
export const OutlinedPrimary: Story = createButtonStory('outlined', 'primary');
export const Text: Story = createButtonStory('text');
export const Ghost: Story = createButtonStory('ghost', 'gray');
