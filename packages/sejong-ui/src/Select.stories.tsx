import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './Select';

const meta = {
  title: 'SejongUI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    essential: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  <option key="1">Option 1</option>,
  <option key="2">Option 2</option>,
  <option key="3">Option 3</option>,
];

export const Default: Story = {
  args: {
    children: defaultOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    children: [
      <option key="0" value="" disabled selected>
        Please select an option
      </option>,
      ...defaultOptions,
    ],
  },
};

export const Essential: Story = {
  args: {
    children: defaultOptions,
    essential: true,
  },
};

export const Disabled: Story = {
  args: {
    children: defaultOptions,
    disabled: true,
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: defaultOptions,
    className: 'w-48 h-12 text-base',
  },
};
