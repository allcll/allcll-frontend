import type { Meta, StoryObj } from '@storybook/react-vite';

import Heading from './Heading';

const meta = {
  title: 'AllcllUI/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: { type: 'text' } },
  },
  args: {
    children: 'Heading',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  args: { level: 4 },
  render: () => (
    <ul className="flex flex-col gap-5 items-center">
      <li>
        <Heading level={1}>ALLCLL 타이틀 예시: xxLarge</Heading>
      </li>
      <li>
        <Heading level={2}>ALLCLL 타이틀 예시: xLarge</Heading>
      </li>
      <li>
        <Heading level={3}>ALLCLL 타이틀 예시: large</Heading>
      </li>
      <li>
        <Heading level={4}>ALLCLL 타이틀 예시: medium</Heading>
      </li>
      <li>
        <Heading level={5}>ALLCLL 타이틀 예시: small</Heading>
      </li>
    </ul>
  ),
};
