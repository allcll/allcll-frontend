import { Fragment } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './Select';

const VARIANTS = ['outlined', 'plain'] as const;

const meta = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '브라우저 기본 select에 공통 스타일을 입힌 선택 상자입니다. 선택지가 많아 검색이 필요하면 SearchableSelect를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { description: '모양', control: 'inline-radio', options: VARIANTS },
    disabled: { description: '고를 수 없는 상태', control: 'boolean' },
    children: { description: '`option` 요소들', control: false },
    className: { table: { disable: true } },
  },
  args: {
    variant: 'outlined',
    disabled: false,
    className: 'w-48',
    children: (
      <>
        <option value="mon">월요일</option>
        <option value="tue">화요일</option>
        <option value="wed">수요일</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'none' },
      description: {
        story: '모양별 모습입니다. plain은 테두리 없이 주변 글자 크기와 색을 따르므로 글자 사이에 둘 때 사용합니다.',
      },
    },
  },
  argTypes: {
    variant: { control: false },
  },
  render: args => (
    <div className="grid grid-cols-[auto_auto] items-center gap-4 text-sm text-fg-muted">
      {VARIANTS.map(variant => (
        <Fragment key={variant}>
          <span className="text-xs">{variant}</span>
          <Select {...args} variant={variant} className={variant === 'outlined' ? 'w-48' : ''} />
        </Fragment>
      ))}
    </div>
  ),
};
