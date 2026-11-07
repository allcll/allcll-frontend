import type { Meta, StoryObj } from '@storybook/react-vite';

import Tooltip from './Tooltip';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '도움말 아이콘을 누르면 보조 설명을 말풍선으로 보여줍니다. 꼭 알아야 하는 정보는 툴팁에 숨기지 않고 화면에 바로 적습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { description: '말풍선 내용', control: 'text' },
    layer: { description: '겹침 순서(z-index 단계)', control: false },
  },
  args: {
    children: '여석이 생기면 알림을 보내드려요.',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
