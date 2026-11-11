import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import RangeSlider from './RangeSlider';

const formatTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const meta = {
  title: 'Form/RangeSlider',
  component: RangeSlider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '두 손잡이로 시작과 끝 사이의 범위를 고르는 슬라이더입니다. 끄는 동안 바뀌는 값과 손을 뗀 뒤 확정된 값을 따로 받을 수 있어, 목록은 확정될 때만 다시 거르게 할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    min: { description: '고를 수 있는 가장 작은 값', control: 'number' },
    max: { description: '고를 수 있는 가장 큰 값', control: 'number' },
    step: { description: '한 번에 움직이는 단위', control: 'number' },
    value: { description: '고른 범위(시작, 끝)', control: false },
    onValueChange: { description: '끄는 동안 값이 바뀔 때 호출하는 함수', control: false },
    onValueCommit: { description: '손을 떼어 값이 확정될 때 호출하는 함수', control: false },
    thumbLabels: { description: '두 손잡이를 스크린 리더가 읽을 이름', control: false },
    className: { table: { disable: true } },
  },
  args: {
    min: 9 * 60,
    max: 22 * 60,
    step: 30,
    value: [9 * 60, 22 * 60],
    onValueChange: () => {},
    thumbLabels: ['시간대 시작 시각', '시간대 끝 시각'],
  },
  render: function Render(args) {
    const [value, setValue] = useState<[number, number]>([args.min, args.max]);
    const [committed, setCommitted] = useState<[number, number]>([args.min, args.max]);

    useEffect(() => {
      setValue([args.min, args.max]);
      setCommitted([args.min, args.max]);
    }, [args.min, args.max]);

    return (
      <div className="flex flex-col gap-2 w-80">
        <RangeSlider {...args} value={value} onValueChange={setValue} onValueCommit={setCommitted} />
        <span className="text-right text-xs text-gray-500">
          {`${formatTime(value[0])} ~ ${formatTime(value[1])} (확정: ${formatTime(committed[0])} ~ ${formatTime(committed[1])})`}
        </span>
      </div>
    );
  },
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
