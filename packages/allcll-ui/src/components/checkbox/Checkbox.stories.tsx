import type { Meta, StoryObj } from '@storybook/react-vite';

import Checkbox from './Checkbox';

const meta = {
  title: 'AllcllUI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: { type: 'text' } },
  },
  args: {
    label: 'Checkbox',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checkboxes: Story = {
  render: () => (
    <ul className="flex flex-wrap gap-5">
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Checked</h6>
        <Checkbox checked />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Unchecked</h6>
        <Checkbox />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Checked with Label</h6>
        <Checkbox checked label="checkbox" />
      </li>
      <li className="flex flex-col items-center">
        <h6 className="text-gray-500">Unchecked with Label</h6>
        <Checkbox label="checkbox" />
      </li>
    </ul>
  ),
  argTypes: {
    checked: {
      control: false,
    },
    label: {
      control: false,
    },
  },
};
