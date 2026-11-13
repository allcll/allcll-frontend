import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from './Spinner';

const SIZES = ['small', 'medium', 'large'] as const;

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '작은 영역에서 불러오는 중일 때 보여주는 회전 아이콘입니다. 영역 전체를 채울 때는 LoadingState를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: { description: '크기', control: 'radio', options: SIZES },
    label: { description: '스크린 리더가 읽을 문구', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    size: 'medium',
    label: '불러오는 중',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '크기별 모습입니다.' },
    },
  },
  argTypes: {
    size: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto] items-center gap-4">
      {SIZES.map(size => (
        <Fragment key={size}>
          <span className="text-xs text-fg-muted">{size}</span>
          <Spinner {...args} size={size} />
        </Fragment>
      ))}
    </div>
  ),
};
