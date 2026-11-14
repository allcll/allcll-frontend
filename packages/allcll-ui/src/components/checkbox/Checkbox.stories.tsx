import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Checkbox from './Checkbox';

const STATES = [
  { label: '선택 안 됨', checked: false, disabled: false },
  { label: '선택됨', checked: true, disabled: false },
  { label: '비활성', checked: false, disabled: true },
  { label: '선택됨, 비활성', checked: true, disabled: true },
];

const meta = {
  title: 'Form/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '여러 개를 함께 고를 수 있는 체크박스입니다. 하나만 고르는 경우에는 SegmentedControl이나 Select를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: { description: '옆에 붙는 문구', control: 'text' },
    checked: { description: '선택 상태', control: false },
    disabled: { description: '선택할 수 없는 상태', control: 'boolean' },
  },
  args: {
    label: '일주일간 보지 않기',
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);

    return <Checkbox {...args} checked={checked} onChange={() => setChecked(prev => !prev)} />;
  },
};

export const States: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '선택과 비활성 상태 조합입니다.' },
    },
  },
  argTypes: {
    disabled: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto] items-center gap-4">
      {STATES.map(state => (
        <Fragment key={state.label}>
          <span className="text-xs text-fg-muted">{state.label}</span>
          <Checkbox {...args} checked={state.checked} disabled={state.disabled} readOnly />
        </Fragment>
      ))}
    </div>
  ),
};
