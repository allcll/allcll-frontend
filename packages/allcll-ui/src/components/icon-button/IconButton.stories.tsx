import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import IconButton from './IconButton';
import { SettingsAdjustIcon } from '../../icons';

const VARIANTS = ['contain', 'plain'] as const;

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '아이콘만 있는 버튼입니다. 글자가 없으므로 `label`에 스크린 리더가 읽을 이름을 반드시 넣습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { description: '배경 유무', control: 'radio', options: VARIANTS },
    label: { description: '스크린 리더가 읽을 이름', control: 'text' },
    icon: { description: '표시할 아이콘', control: false },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'plain',
    label: '필터',
    icon: <SettingsAdjustIcon className="w-4 h-4 text-gray-400" />,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '모양별 모습입니다.' },
    },
  },
  argTypes: {
    variant: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto] items-center gap-4">
      {VARIANTS.map(variant => (
        <Fragment key={variant}>
          <span className="text-xs text-gray-500">{variant}</span>
          <IconButton {...args} variant={variant} />
        </Fragment>
      ))}
    </div>
  ),
};
