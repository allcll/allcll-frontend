import type { Meta, StoryObj } from '@storybook/react-vite';
import Skeleton from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '불러오는 동안 내용이 들어올 자리를 회색 상자로 미리 잡아 둡니다. 불러온 뒤 화면이 튀지 않게 실제 내용과 비슷한 크기로 맞춥니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { description: '크기와 모양', control: 'text' },
  },
  args: {
    className: 'h-4 w-64',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExampleCardList: Story = {
  parameters: {
    docs: { description: { story: '카드 목록 자리를 잡은 모습입니다.' } },
  },
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
      <Skeleton className="h-24 rounded-lg" />
    </div>
  ),
};
