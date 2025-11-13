import type { Meta, StoryObj } from '@storybook/react-vite';

import Input from './Input';
import IconButton from '../icon-button/IconButton';
import SearchSvg from '@/assets/search.svg?react';
import DeleteSvg from '@/assets/x-gray.svg?react';

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
      <IconButton label="검색" variant="plain" icon={<SearchSvg />} className="absolute left-3 top-3 text-gray-500" />
    ),
    rightIcon: (
      <IconButton
        label="삭제"
        variant="plain"
        icon={<DeleteSvg />}
        className="absolute right-3 top-4 text-gray-500"
        onClick={() => alert('삭제 버튼 클릭됨')}
      />
    ),
  },
};
