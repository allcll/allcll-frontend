import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './Select';

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
    disabled: { description: '고를 수 없는 상태', control: 'boolean' },
    children: { description: '`option` 요소들', control: false },
    className: { table: { disable: true } },
  },
  args: {
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
