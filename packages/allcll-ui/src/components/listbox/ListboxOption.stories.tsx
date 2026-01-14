import type { Meta, StoryObj } from '@storybook/react-vite';
import ListboxOption from './ListboxOption';
import CheckSvg from '@/assets/check.svg?react';

const meta = {
  title: 'AllcllUI/ListboxOption',
  component: ListboxOption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ListboxOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: true,
    left: '리스트 옵션',
    right: <CheckSvg className="w-4 h-4 shrink-0" />
  },
};

export const Unselected: Story = {
  args: {
    selected: false,
    left: '리스트 옵션',
    right: <CheckSvg className="w-4 h-4 shrink-0" />
  },
};
