import type { Meta, StoryObj } from '@storybook/react-vite';

import Input from './Input';
import IconButton from '../icon-button/IconButton';
import { CloseIcon, SearchIcon } from '../../icons';

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
        icon={<SearchIcon size={20} className="text-gray-400" />}
        className="absolute left-3 top-3"
      />
    ),
    rightIcon: (
      <IconButton
        label="삭제"
        variant="plain"
        icon={<CloseIcon size={20} className="text-gray-400" />}
        className="absolute right-3 top-3"
        onClick={() => alert('삭제 버튼 클릭됨')}
      />
    ),
  },
};
