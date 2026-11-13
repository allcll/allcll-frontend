import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Listbox from './Listbox';
import ListboxOption from './ListboxOption';
import { CheckmarkIcon } from '../../icons';

const DEPARTMENTS = [
  '컴퓨터공학과',
  '소프트웨어학과',
  '인공지능데이터사이언스학과',
  '전자정보통신공학과',
  '수학통계학과',
];

const CHECK = <CheckmarkIcon className="w-4 h-4 shrink-0 text-primary-500" />;

const STATES = [
  { label: '선택됨', selected: true, active: false },
  { label: '선택 안 됨', selected: false, active: false },
  { label: '키보드 포커스', selected: false, active: true },
];

const meta = {
  title: 'Form/Listbox',
  component: Listbox,
  subcomponents: { ListboxOption },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '여러 선택지 중 하나를 고르는 목록입니다. 선택된 항목에는 오른쪽에 체크 표시가 나타납니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bordered: { description: '테두리 여부', control: 'boolean' },
    'aria-label': { description: '스크린 리더가 읽을 이름', control: 'text' },
    children: { description: 'ListboxOption 목록', control: false },
    className: { table: { disable: true } },
  },
  args: {
    bordered: true,
    'aria-label': '학과',
  },
  render: function Render(args) {
    const [selected, setSelected] = useState(DEPARTMENTS[0]);

    return (
      <Listbox {...args} className="w-64">
        {DEPARTMENTS.map(department => (
          <ListboxOption
            key={department}
            selected={department === selected}
            left={department}
            right={CHECK}
            onSelect={() => setSelected(department)}
          />
        ))}
      </Listbox>
    );
  },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '선택지 한 줄의 선택, 기본, 키보드 포커스 상태입니다.' },
    },
  },
  render: () => (
    <div className="grid grid-cols-[auto_14rem] items-center gap-4">
      {STATES.map(state => (
        <Fragment key={state.label}>
          <span className="text-xs text-fg-muted">{state.label}</span>
          <Listbox aria-label={state.label}>
            <ListboxOption selected={state.selected} active={state.active} left="컴퓨터공학과" right={CHECK} />
          </Listbox>
        </Fragment>
      ))}
    </div>
  ),
};
