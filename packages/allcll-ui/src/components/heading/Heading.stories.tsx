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
  render: () => {
    const [size, setSize] = useState<'xxLarge' | 'xLarge' | 'large' | 'medium' | 'small' | 'xSmall'>('medium');
    return (
      <ul className="flex flex-col gap-5 items-center">
        <li>
          <select
            value={size}
            onChange={e => setSize(e.target.value as 'xxLarge' | 'xLarge' | 'large' | 'medium' | 'small' | 'xSmall')}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="xxLarge">xxLarge</option>
            <option value="xLarge">xLarge</option>
            <option value="large">large</option>
            <option value="medium">medium</option>
            <option value="small">small</option>
            <option value="xSmall">xSmall</option>
          </select>
        </li>

        <li>
          <Heading size={size}>ALLCLL 타이틀 예시: {size}</Heading>
        </li>
      </ul>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <ul className="flex flex-col gap-5 items-center">
      <li>
        <Heading size="xxLarge">ALLCLL 타이틀 예시: xxLarge</Heading>
      </li>
      <li>
        <Heading size="xLarge">ALLCLL 타이틀 예시: xLarge</Heading>
      </li>
      <li>
        <Heading size="large">ALLCLL 타이틀 예시: large</Heading>
      </li>
      <li>
        <Heading size="medium">ALLCLL 타이틀 예시: medium</Heading>
      </li>
      <li>
        <Heading size="small">ALLCLL 타이틀 예시: small</Heading>
      </li>
      <li>
        <Heading size="xSmall">ALLCLL 타이틀 예시: xSmall</Heading>
      </li>
    </ul>
  ),
};
