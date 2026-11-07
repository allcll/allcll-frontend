import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from './Textarea';

const meta = {
  title: 'AllcllUI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    placeholder: '내용을 입력해주세요',
    className: 'w-80',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
