import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';
import Button from '../button/Button';
import { SearchIcon, NotificationIcon } from '../../icons';

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '목록이 비었거나 결과가 없을 때 보여주는 안내입니다. 빈 상태를 벗어날 수 있는 동작이 있으면 버튼을 함께 넣습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { description: '제목 위 아이콘 컴포넌트', control: false },
    title: { description: '안내 제목', control: 'text' },
    description: { description: '보조 설명', control: 'text' },
    children: { description: '설명 아래 버튼', control: false },
    className: { table: { disable: true } },
  },
  args: {
    icon: SearchIcon,
    title: '검색 결과가 없습니다.',
    description: '다른 검색어로 다시 시도해보세요.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExampleWithAction: Story = {
  parameters: {
    docs: { description: { story: '빈 상태를 벗어날 수 있는 버튼을 함께 둔 모습입니다.' } },
  },
  args: {
    icon: NotificationIcon,
    title: '등록된 알림 과목이 없습니다',
    description: '관심 있는 과목을 알림 과목으로 등록해보세요. 여석이 생길 시 알림을 보내드려요.',
    children: (
      <Button variant="solid" size="small">
        알림 과목 등록
      </Button>
    ),
  },
};
