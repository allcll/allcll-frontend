import { Fragment, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Toggle from './Toggle';

const STATES = [
  { label: '꺼짐', checked: false, disabled: false },
  { label: '켜짐', checked: true, disabled: false },
  { label: '비활성', checked: false, disabled: true },
];

const meta = {
  title: 'Form/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '설정을 즉시 켜고 끄는 스위치입니다. 저장 버튼을 눌러야 반영되는 항목에는 Checkbox를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: { description: '켜짐 상태', control: false },
    disabled: { description: '바꿀 수 없는 상태', control: 'boolean' },
    onCheckedChange: { description: '상태가 바뀔 때 호출하는 함수', control: false },
    className: { table: { disable: true } },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);

    return <Toggle {...args} checked={checked} onCheckedChange={setChecked} />;
  },
};

export const States: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '꺼짐, 켜짐, 비활성 상태입니다.' },
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
          <Toggle {...args} checked={state.checked} disabled={state.disabled} onCheckedChange={() => {}} />
        </Fragment>
      ))}
    </div>
  ),
};
