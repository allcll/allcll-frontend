import type { Meta, StoryObj } from '@storybook/react-vite';

import Tooltip from './Tooltip';

const meta = {
  title: 'AllcllUI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: '툴팁 내용입니다.',
  },
};

export const Default: Story = {
  args: {
    children: '툴팁 내용입니다.',
  },
};
