import type { Meta, StoryObj } from '@storybook/react-vite';
import TextLink from './TextLink';

const meta = {
  title: 'Actions/TextLink',
  component: TextLink,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '문장 안에 들어가는 링크입니다. 버튼처럼 보여야 하는 동작에는 글자 버튼을 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    href: { description: '이동할 주소', control: 'text' },
    children: { description: '링크 문구', control: 'text' },
    asChild: { description: '자식 요소에 링크 스타일을 입힐지 여부', control: false },
    className: { table: { disable: true } },
  },
  args: {
    href: '#',
    children: '문의하기',
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ExampleInSentence: Story = {
  parameters: {
    docs: { description: { story: '문장 안에서 쓰는 모습입니다.' } },
  },
  render: args => (
    <p className="text-sm text-fg-secondary">
      문제가 계속되면 <TextLink {...args} />로 알려주세요.
    </p>
  ),
};

export const ExampleAsButton: Story = {
  parameters: {
    docs: {
      description: {
        story: '페이지 이동 대신 동작을 실행할 때 버튼 요소에 링크 모양을 입힌 모습입니다.',
      },
    },
  },
  render: () => (
    <TextLink asChild>
      <button type="button">오류 제보</button>
    </TextLink>
  ),
};
