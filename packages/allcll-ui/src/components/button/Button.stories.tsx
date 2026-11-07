import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Button from './Button';
import { HomeIcon } from '../../icons';

const VARIANTS = ['solid', 'outlined', 'text', 'pill'] as const;
const COLORS = ['primary', 'gray', 'danger'] as const;
const SIZES = ['small', 'medium', 'large'] as const;

const meta = {
  title: 'Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '누르면 동작을 실행하는 버튼입니다. 한 영역에서 가장 중요한 동작 하나만 파란 버튼으로 강조하고, 취소 같은 보조 동작은 회색 버튼, 테두리 버튼, 글자 버튼으로 낮춥니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: '버튼 모양',
      control: 'radio',
      options: VARIANTS,
    },
    color: {
      description: '색',
      control: 'radio',
      options: COLORS,
    },
    size: {
      description: '높이와 글자 크기',
      control: 'radio',
      options: SIZES,
    },
    disabled: {
      description: '눌리지 않는 상태',
      control: 'boolean',
    },
    asChild: {
      description: '자식 요소에 버튼 스타일을 입힐지 여부',
      control: false,
    },
    children: {
      description: '버튼 내용',
      control: 'text',
    },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'solid',
    color: 'primary',
    size: 'medium',
    disabled: false,
    children: '저장하기',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: { story: '모양과 색 조합입니다.' },
    },
  },
  argTypes: {
    variant: { control: false },
    color: { control: false },
  },
  render: ({ size, disabled, children }) => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-4">
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
            <Button key={color} variant={variant} color={color} size={size} disabled={disabled}>
              {children}
            </Button>
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
      description: {
        story:
          '크기별 모습입니다. 아이콘은 크기를 따로 정하지 않아도 버튼 크기에 맞춰집니다. 아이콘만 있는 버튼은 IconButton을 사용합니다.',
      },
    },
  },
  argTypes: {
    size: { control: false },
  },
  render: ({ variant, color, disabled, children }) => (
    <div className="grid grid-cols-[auto_auto_auto] items-center gap-4">
      {SIZES.map(size => (
        <Fragment key={size}>
          <span className="text-xs text-gray-500">{size}</span>
          <Button variant={variant} color={color} size={size} disabled={disabled}>
            {children}
          </Button>
          <Button variant={variant} color={color} size={size} disabled={disabled}>
            <HomeIcon />
            {children}
          </Button>
        </Fragment>
      ))}
    </div>
  ),
};
