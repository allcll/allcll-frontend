import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Banner from './Banner';

const VARIANTS = ['info', 'danger'] as const;

const meta = {
  title: 'Feedback/Banner',
  component: Banner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지 위쪽에 놓는 안내 띠입니다. 공지처럼 사용자가 닫을 수 있는 안내는 오른쪽에 닫기 버튼을 두고, 연결 끊김처럼 상황이 풀리면 저절로 사라지는 안내는 닫기 버튼 없이 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { description: '안내 성격', control: 'radio', options: VARIANTS },
    children: { description: '안내 문구', control: 'text' },
    onClose: { description: '닫기 버튼을 눌렀을 때 호출하는 함수', control: false },
  },
  args: {
    variant: 'info',
    children: '알림이 울리지 않나요? 문제 해결하기',
    onClose: () => {},
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '안내 성격별 모습입니다.' },
    },
  },
  argTypes: {
    variant: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto] items-center gap-4">
      {VARIANTS.map(variant => (
        <Fragment key={variant}>
          <span className="text-xs text-fg-muted">{variant}</span>
          <Banner {...args} variant={variant} />
        </Fragment>
      ))}
    </div>
  ),
};
