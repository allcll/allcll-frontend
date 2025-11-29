import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';

const meta = {
  title: 'SejongUI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'number', 'email'],
    },
    placeholder: {
      control: 'text',
    },
    essential: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    value: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Default Input',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Input with value',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password Input',
  },
};

export const Essential: Story = {
  args: {
    placeholder: 'Essential Input',
    essential: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled Input',
    disabled: true,
  },
};

export const WithCustomClassName: Story = {
  args: {
    placeholder: 'Custom Class',
    className: 'w-64 h-12 text-base',
  },
};
