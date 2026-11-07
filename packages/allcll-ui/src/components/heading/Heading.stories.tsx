import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Heading from './Heading';

const LEVELS = [1, 2, 3, 4, 5] as const;

const meta = {
  title: 'Display/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '페이지나 구역의 제목을 나타냅니다. 화면 구조에 맞는 단계(h1~h5)를 고르면 크기가 함께 정해집니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: { description: '제목 단계(h1~h5)', control: 'radio', options: LEVELS },
    children: { description: '제목 문구', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    level: 2,
    children: '실시간 수강 여석',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Levels: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '단계별 기본 크기입니다.' },
    },
  },
  argTypes: {
    level: { control: false },
  },
  render: ({ children }) => (
    <div className="grid grid-cols-[auto_auto] items-center gap-x-6 gap-y-4">
      {LEVELS.map(level => (
        <Fragment key={level}>
          <span className="text-xs text-gray-500">level {level}</span>
          <Heading level={level}>{children}</Heading>
        </Fragment>
      ))}
    </div>
  ),
};
