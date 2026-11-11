import type { Meta, StoryObj } from '@storybook/react-vite';
import Label from './Label';

const meta = {
  title: 'Form/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '입력 요소 위에 붙여 무엇을 입력하는지 알려주는 이름입니다. 필수 항목에는 별표가 붙습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    required: { description: '필수 표시(*)', control: 'boolean' },
    children: { description: '라벨 문구', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    required: false,
    children: '학번',
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
