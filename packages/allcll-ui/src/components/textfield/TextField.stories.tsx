import type { Meta, StoryObj } from '@storybook/react-vite';
import TextField from './TextField';

const meta = {
  title: 'AllcllUI/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    required: true,
    id: 'name',
    label: '입력',
    size: 'medium',
    placeholder: '텍스트를 입력해주세요',
  },
};

export const Default: Story = {
  args: {
    label: '입력',
    required: true,
    size: 'medium',
    id: 'name',
    placeholder: '텍스트를 입력해주세요',
  },
};

export const Error: Story = {
  args: {
    label: '입력',
    required: true,
    isError: true,
    size: 'medium',
    errorMessage: '에러 메시지입니다.',
    id: 'name',
    placeholder: '텍스트를 입력해주세요',
  },
};
