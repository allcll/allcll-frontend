import type { Meta, StoryObj } from '@storybook/react-vite';

import Input from './Input';
import IconButton from '../icon-button/IconButton';
import SearchSvg from '@/assets/search.svg?react';
import DeleteSvg from '@/assets/x.svg?react';

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
  tags: ['autodocs'],
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
    leftIcon: (
      <IconButton
        label="검색"
        variant="plain"
        icon={<SearchSvg className="w-5 h-5 text-gray-400" />}
        className="absolute left-3 top-3"
      />
    ),
    rightIcon: (
      <IconButton
        label="삭제"
        variant="plain"
        icon={<DeleteSvg className="w-5 h-5 text-gray-400" />}
        className="absolute right-3 top-3"
        onClick={() => alert('삭제 버튼 클릭됨')}
      />
    ),
  },
};
