import type { Meta, StoryObj } from '@storybook/react-vite';
import LoadingState from './LoadingState';

const meta = {
  title: 'Feedback/LoadingState',
  component: LoadingState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '데이터를 불러오는 동안 영역 전체에 보여주는 안내입니다. 작은 영역에는 Spinner, 자리를 미리 잡아야 하는 목록에는 Skeleton을 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { description: '안내 제목', control: 'text' },
    description: { description: '보조 설명', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    title: '관심과목 현황을 불러오는 중입니다.',
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
