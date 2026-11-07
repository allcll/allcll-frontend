import type { Meta, StoryObj } from '@storybook/react-vite';
import TextLink from './TextLink';

const meta = {
  title: 'AllcllUI/TextLink',
  component: TextLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    href: '#',
    children: '문의하기',
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InSentence: Story = {
  render: args => (
    <p className="text-sm text-gray-700">
      문제가 계속되면 <TextLink {...args} />로 알려주세요.
    </p>
  ),
};

export const AsButton: Story = {
  render: () => (
    <TextLink asChild>
      <button type="button">오류 제보</button>
    </TextLink>
  ),
};
