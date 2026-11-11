import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Card from './Card';
import Heading from '../heading/Heading';
import SupportingText from '../supportingText/SupportingText';
import Badge from '../badge/Badge';

const VARIANTS = ['elevated', 'outlined', 'filled'] as const;

const SUBJECT_CONTENT = (
  <div className="flex flex-col gap-1 w-56">
    <div className="flex items-center justify-between">
      <Heading level={4}>해석학개론2</Heading>
      <span className="text-sm text-gray-500">차영준</span>
    </div>
    <SupportingText>월수16:30-18:00 | 영301</SupportingText>
    <SupportingText>2학년 | 수학통계학과</SupportingText>
    <div className="mt-1">
      <Badge color="gray" size="small">
        3학점
      </Badge>
    </div>
  </div>
);

const meta = {
  title: 'Display/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '관련된 내용을 하나로 묶는 상자입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { description: '모양', control: 'radio', options: VARIANTS },
    children: { description: '카드 내용', control: false },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'elevated',
    children: SUBJECT_CONTENT,
  },
} satisfies Meta<typeof Card>;

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
    <div className="grid grid-cols-[auto_auto] items-center gap-4 bg-gray-50 p-6">
      {VARIANTS.map(variant => (
        <Fragment key={variant}>
          <span className="text-xs text-gray-500">{variant}</span>
          <Card {...args} variant={variant} />
        </Fragment>
      ))}
    </div>
  ),
};
