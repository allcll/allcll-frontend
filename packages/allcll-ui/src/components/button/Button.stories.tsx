import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';

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
    children: '올클 버튼',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: ({ size, children }) => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Primary</h6>
        <Button variant="primary" size={size}>
          {children}
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Secondary</h6>
        <Button variant="secondary" size={size}>
          {children}
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Danger</h6>
        <Button variant="danger" size={size}>
          {children}
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Text</h6>
        <Button variant="text" size={size}>
          {children}
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Outlined</h6>
        <Button variant="outlined" size={size}>
          {children}
        </Button>
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Ghost</h6>
        <Button variant="ghost" size={size}>
          {children}
        </Button>
      </li>
    </ul>
  ),
  argTypes: {
    variant: { control: false },
  },
};

export const Sizes: Story = {
  render: ({ variant, children }) => (
    <div className="flex flex-wrap gap-4">
      <div>
        <h2>Small</h2>
        <Button variant={variant} size="small">
          {children}
        </Button>
      </div>
      <div>
        <h2>Medium</h2>
        <Button variant={variant} size="medium">
          {children}
        </Button>
      </div>
      <div>
        <h2>Large</h2>
        <Button variant={variant} size="large">
          {children}
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
