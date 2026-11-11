import type { Meta, StoryObj } from '@storybook/react-vite';
import Textarea from './Textarea';

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '여러 줄을 입력하는 칸입니다. 기본적으로 부모 폭을 가득 채우고, 높이는 사용자가 아래로 늘릴 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { description: '안내 문구', control: 'text' },
    disabled: { description: '입력할 수 없는 상태', control: 'boolean' },
    rows: { description: '기본 줄 수', control: 'number' },
    className: { table: { disable: true } },
  },
  args: {
    placeholder: '오류 내용을 작성해주시면 서비스에 큰 도움이 됩니다.',
    disabled: false,
    rows: 4,
    className: 'w-80',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
