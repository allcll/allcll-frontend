import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import ModalHeader from './ModalHeader';

const meta = {
  title: 'SejongUI/Modal/ModalHeader',
  component: ModalHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    onClose: {
      action: 'closed',
    },
  },
} satisfies Meta<typeof ModalHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Header',
    onClose: fn(),
  },
};

export const LongTitle: Story = {
  args: {
    title: 'This is a very long header title to test how it wraps or truncates within the modal header component.',
    onClose: fn(),
  },
};

export const WithSpecialCharacters: Story = {
  args: {
    title: 'Header with !@#$%^&*()_+',
    onClose: fn(),
  },
};
