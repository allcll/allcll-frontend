import type { Meta, StoryObj } from '@storybook/react-vite';

import Toast from './Toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '동작 결과를 잠깐 알려주는 메시지입니다. 앱에서는 직접 렌더링하지 않고 `@allcll/common`의 `useToastNotification`으로 띄웁니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: { description: '알림 문구', control: 'text' },
    onClose: { description: '닫을 때 호출하는 함수', control: false },
  },
  args: {
    message: '로그인되었습니다.',
    onClose: () => {},
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
