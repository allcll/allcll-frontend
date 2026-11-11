import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Badge from './Badge';

const COLORS = ['success', 'warning', 'danger', 'primary', 'gray'] as const;
const VARIANTS = ['filled', 'outlined'] as const;
const SIZES = ['small', 'medium'] as const;

const meta = {
  title: 'Display/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '상태나 수치를 짧게 보여주는 작은 표시입니다. 눌러야 하는 경우에는 Chip을 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: { description: '색', control: 'radio', options: COLORS },
    variant: { description: '모양', control: 'radio', options: VARIANTS },
    size: { description: '크기', control: 'radio', options: SIZES },
    children: { description: '표시할 내용', control: 'text' },
  },
  args: {
    color: 'success',
    variant: 'filled',
    size: 'medium',
    children: '여석 100',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '색과 모양 조합입니다.' },
    },
  },
  argTypes: {
    color: { control: false },
    variant: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-4">
      <span />
      {COLORS.map(color => (
        <span key={color} className="text-xs text-gray-500">
          {color}
        </span>
      ))}
      {VARIANTS.map(variant => (
        <Fragment key={variant}>
          <span className="text-xs text-gray-500">{variant}</span>
          {COLORS.map(color => (
            <div key={color}>
              <Badge {...args} color={color} variant={variant} />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

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
          <span className="text-xs text-gray-500">{size}</span>
          <div>
            <Badge {...args} size={size} />
          </div>
        </Fragment>
      ))}
    </div>
  ),
};
