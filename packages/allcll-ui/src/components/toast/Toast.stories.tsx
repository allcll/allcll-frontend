import type { Meta, StoryObj } from '@storybook/react-vite';

import Toast from './Toast';

const meta = {
  title: 'AllcllUI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    toast: {
      message: '토스트 메시지 입니다.',
      tag: 'info',
    },
    closeToast: () => {},
  },
};

export const Default: Story = {
  args: {
    toast: {
      message: '토스트 메시지 입니다.',
      tag: 'info',
    },
    closeToast: () => {},
  },
};
