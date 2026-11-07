import type { Meta, StoryObj } from '@storybook/react-vite';
import SupportingText from './SupportingText';

const meta = {
  title: 'Display/SupportingText',
  component: SupportingText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '제목이나 입력 요소 아래에 붙는 보조 설명입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { description: '설명 문구', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    children: '등록된 운영 기간이 없습니다.',
  },
} satisfies Meta<typeof SupportingText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
