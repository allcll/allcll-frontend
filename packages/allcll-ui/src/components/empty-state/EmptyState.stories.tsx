import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';
import Button from '../button/Button';
import { SearchIcon, NotificationIcon } from '../../icons';

const meta = {
  title: 'AllcllUI/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    title: '검색 결과가 없습니다.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {};

export const WithIcon: Story = {
  args: {
    icon: SearchIcon,
    description: '다른 검색어로 다시 시도해보세요.',
  },
};

export const WithAction: Story = {
  args: {
    icon: NotificationIcon,
    title: '등록된 알림 과목이 없습니다',
    description: '관심있는 과목을 알림 과목으로 등록해보세요.',
    children: (
      <Button variant="primary" size="small">
        과목 등록하기
      </Button>
    ),
  },
};
