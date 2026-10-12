import type { Meta, StoryObj } from '@storybook/react-vite';
import Toggle from './Toggle';

const meta = {
  title: 'AllcllUI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    checked: false,
    onCheckedChange: () => {},
  },
};

export const Default: Story = {
  args: {
    checked: false,
    onCheckedChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    onCheckedChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    onCheckedChange: () => {},
  },
};
