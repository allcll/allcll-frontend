import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import SearchableSelect from './SearchableSelect';

const DEPARTMENTS = [
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
  title: 'Form/SearchableSelect',
  component: SearchableSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '검색해서 하나를 고르는 선택 상자입니다. 학과처럼 선택지가 많을 때 사용하고, 적으면 Select를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: { description: '선택지 목록(`value`, `label`)', control: false },
    value: { description: '선택된 값', control: false },
    onChange: { description: '고를 때 호출하는 함수', control: false },
    placeholder: { description: '선택 전 안내 문구', control: 'text' },
    searchPlaceholder: { description: '검색창 안내 문구', control: 'text' },
    emptyMessage: { description: '검색 결과가 없을 때 문구', control: 'text' },
    emptyDescription: { description: '검색 결과가 없을 때 보조 설명', control: 'text' },
    filterOption: { description: '검색어로 선택지를 거르는 함수', control: false },
    disabled: { description: '고를 수 없는 상태', control: 'boolean' },
    'aria-label': { description: '스크린 리더가 선택값 앞에 읽을 이름', control: 'text' },
    'aria-labelledby': { description: '이름으로 읽을 라벨 요소의 id', control: false },
    id: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    options: DEPARTMENTS,
    value: null,
    onChange: () => {},
    placeholder: '학과를 선택하세요',
    searchPlaceholder: '학과 검색',
    disabled: false,
    className: 'w-64',
  },
} satisfies Meta<typeof SearchableSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);

    return <SearchableSelect {...args} value={value} onChange={setValue} />;
  },
};
