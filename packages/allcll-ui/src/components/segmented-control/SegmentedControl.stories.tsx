import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import SegmentedControl from './SegmentedControl';

type Mode = 'common' | 'perDay';

type Option = { value: Mode; label: string; disabled?: boolean };

const OPTIONS: Option[] = [
  { value: 'common', label: '공통' },
  { value: 'perDay', label: '요일별' },
];

const STATES: { label: string; options: Option[] }[] = [
  { label: '기본', options: OPTIONS },
  { label: '선택지 비활성', options: [OPTIONS[0], { ...OPTIONS[1], disabled: true }] },
];

const meta = {
  title: 'Form/SegmentedControl',
  component: SegmentedControl<Mode>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '선택지 중 하나를 눌러 바로 고르는 컴포넌트입니다. 고르는 즉시 화면이 바뀌는 보기 방식 전환에 사용합니다. 선택지가 늘어도 줄바꿈되지 않으므로, 폭이 모자라면 Select를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: { description: '선택지 목록(`value`, `label`, `disabled`)', control: false },
    value: { description: '선택된 값', control: false },
    onValueChange: { description: '고를 때 호출하는 함수', control: false },
    'aria-label': { description: '스크린 리더가 읽을 그룹 이름', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    options: OPTIONS,
    value: 'common',
    onValueChange: () => {},
    'aria-label': '시간대 설정 방식',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
  },
} satisfies Meta<typeof SegmentedControl<Mode>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: {
        story: '기본 상태와 선택지 일부를 고를 수 없는 상태입니다.',
      },
    },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto] items-center gap-4">
      {STATES.map(state => (
        <Fragment key={state.label}>
          <span className="text-xs text-gray-500">{state.label}</span>
          <SegmentedControl {...args} options={state.options} value="common" />
        </Fragment>
      ))}
    </div>
  ),
};
