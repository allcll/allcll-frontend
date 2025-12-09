import type { Meta, StoryObj } from '@storybook/react-vite';
import Label from './Label';

const meta = {
  title: 'AllcllUI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '라벨',
  },
};
