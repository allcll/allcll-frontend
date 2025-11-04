import type { Meta, StoryObj } from '@storybook/react-vite';

import Input from './Input';

const meta = {
  title: 'AllcllUI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    className: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
  },
  args: {
    className: '',
    placeholder: '입력하세요',
  },
} satisfies Meta<typeof Input>;

export default meta;

export const Playground: Story = {};

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
    placeholder: '입력하세요',
  },
};

export const WithDelete: Story = {
  args: {
    className: '',
    placeholder: '입력하세요',
    onDelete: () => alert('삭제 버튼 클릭됨'),
  },
};
