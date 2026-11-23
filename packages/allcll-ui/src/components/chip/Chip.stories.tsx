import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Chip from './Chip';

const VARIANTS = ['outlined', 'filled', 'select', 'cancel'] as const;

const meta = {
  title: 'Actions/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '필터나 선택 항목을 켜고 끄는 칩입니다. 누르면 목록이 펼쳐지는 필터에는 화살표가 있는 칩을, 고른 값을 지우는 곳에는 X 표시가 있는 작은 칩을 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: '칩 모양',
      control: 'radio',
      options: VARIANTS,
    },
    selected: { description: '선택 상태', control: 'boolean' },
    label: { description: '칩 문구', control: 'text' },
    isOpen: {
      description: '연결된 목록이 열려 있는지 여부',
      control: 'boolean',
    },
  },
  args: {
    variant: 'select',
    selected: false,
    label: '학년',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '모양과 선택 상태 조합입니다.' },
    },
  },
  argTypes: {
    variant: { control: false },
    selected: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto_auto] items-center gap-4">
      <span />
      <span className="text-xs text-fg-muted">선택 안 됨</span>
      <span className="text-xs text-fg-muted">선택됨</span>
      {VARIANTS.map(variant => (
        <Fragment key={variant}>
          <span className="text-xs text-fg-muted">{variant}</span>
          <div>
            <Chip {...args} variant={variant} selected={false} />
          </div>
          <div>
            <Chip {...args} variant={variant} selected />
          </div>
        </Fragment>
      ))}
    </div>
  ),
};
