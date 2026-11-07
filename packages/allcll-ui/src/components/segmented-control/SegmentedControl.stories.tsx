import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import SegmentedControl from './SegmentedControl';

type Mode = 'common' | 'perDay' | 'custom';

const OPTIONS: { value: Mode; label: string; disabled?: boolean }[] = [
  { value: 'common', label: '공통' },
  { value: 'perDay', label: '요일별' },
];

const meta = {
  title: 'AllcllUI/SegmentedControl',
  component: SegmentedControl<Mode>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    options: OPTIONS,
    value: 'common',
    onValueChange: () => {},
    'aria-label': '시간대 적용 방식',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
  },
} satisfies Meta<typeof SegmentedControl<Mode>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDisabledOption: Story = {
  args: {
    options: [...OPTIONS, { value: 'custom', label: '직접 입력', disabled: true }],
  },
};
