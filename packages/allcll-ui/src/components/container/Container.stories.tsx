import type { Meta, StoryObj } from '@storybook/react-vite';
import Container from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '페이지 내용의 최대 폭을 제한하고, 화면 폭에 따라 좌우 여백을 줍니다. 헤더, 본문처럼 위아래로 이어지는 영역의 폭과 여백을 맞출 때 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: { description: '안에 들어갈 내용', control: false },
    className: { table: { disable: true } },
  },
  args: {
    children: null,
  },
  render: args => (
    <div className="bg-surface-muted py-6">
      <Container {...args}>
        <div className="rounded-md bg-surface p-4 text-sm text-fg-muted">
          회색 배경이 화면 전체 폭이고, 흰 상자가 Container 안쪽 폭입니다. 창 크기를 바꾸면 좌우 여백이 달라집니다.
        </div>
      </Container>
    </div>
  ),
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
