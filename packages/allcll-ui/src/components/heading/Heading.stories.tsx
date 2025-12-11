import type { Meta, StoryObj } from '@storybook/react-vite';

import { useState } from 'react';
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

export const Playground: Story = {
  args: {
    level: 4,
  },
  render: args => {
    const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(args.level);
    return (
      <ul className="flex flex-col gap-5 items-center">
        <li>
          <select
            value={level}
            onChange={e => setLevel(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            <option value={1}>xxLarge</option>
            <option value={2}>xLarge</option>
            <option value={3}>large</option>
            <option value={4}>medium</option>
            <option value={5}>small</option>
            <option value={6}>xSmall</option>
          </select>
        </li>

        <li>
          <Heading level={level}>ALLCLL 타이틀 예시: {level}</Heading>
        </li>
      </ul>
    );
  },
};

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
