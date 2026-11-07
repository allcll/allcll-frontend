import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchableSelect from './SearchableSelect';

const options = [
  { value: 'cs', label: '컴퓨터공학과' },
  { value: 'sw', label: '소프트웨어학과' },
  { value: 'ai', label: '인공지능데이터사이언스학과' },
  { value: 'ee', label: '전자정보통신공학과' },
  { value: 'math', label: '수학통계학과' },
  { value: 'phys', label: '물리천문학과' },
  { value: 'chem', label: '화학과' },
  { value: 'biz', label: '경영학부' },
  { value: 'econ', label: '경제학과' },
  { value: 'media', label: '미디어커뮤니케이션학과' },
];

const meta = {
  title: 'AllcllUI/SearchableSelect',
  component: SearchableSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    options,
    value: null,
    onChange: () => {},
    placeholder: '학과를 선택하세요',
    searchPlaceholder: '학과 검색',
    className: 'w-64',
  },
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(args.value ?? null);
    return <SearchableSelect {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof SearchableSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    value: 'cs',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
