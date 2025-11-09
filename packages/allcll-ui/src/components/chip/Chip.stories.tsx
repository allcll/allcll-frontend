import type { Meta, StoryObj } from '@storybook/react-vite';

import Chip from './Chip';

const meta = {
  title: 'AllcllUI/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: { type: 'text' } },
  },
  args: {
    label: 'Chip',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Chip',
    selected: false,
  },
};

export const Chips: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <h6>select + 선택됨</h6>
        <Chip selected label="Chip" variant="select" />
      </li>
      <li className="flex flex-col items-center">
        <h6>select + 선택 안 됨</h6>
        <Chip selected={false} label="Chip" variant="select" />
      </li>
      <li className="flex flex-col items-center">
        <h6>cancel + 선택됨</h6>
        <Chip selected label="Chip" variant="cancel" />
      </li>
      <li className="flex flex-col items-center">
        <h6>cancel + 선택 안 됨</h6>
        <Chip selected={false} label="Chip" variant="cancel" />
      </li>
      <li className="flex flex-col items-center">
        <h6>none + 선택됨</h6>
        <Chip selected label="Chip" variant="none" />
      </li>
      <li className="flex flex-col items-center">
        <h6>none + 선택 안 됨</h6>
        <Chip selected={false} label="Chip" variant="none" />
      </li>
    </ul>
  ),
  args: {
    selected: false,
    label: 'Chip',
  },
  argTypes: {
    selected: {
      control: false,
    },
    label: {
      control: false,
    },
  },
};
