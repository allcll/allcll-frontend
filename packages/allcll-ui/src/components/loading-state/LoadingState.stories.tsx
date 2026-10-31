import type { Meta, StoryObj } from '@storybook/react-vite';
import LoadingState from './LoadingState';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

const meta = {
  title: 'AllcllUI/Loading',
  component: LoadingState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    title: '관심과목 현황을 불러오는 중입니다',
  },
};

export const Spinners: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  ),
};
