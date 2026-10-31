import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs from './Tabs';

const ITEMS = ['전공', '교양', '졸업인증'];

const meta = {
  title: 'AllcllUI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: function Render(args) {
    const [selected, setSelected] = useState(ITEMS[0]);

    return (
      <div className="w-80">
        <Tabs {...args}>
          {ITEMS.map(item => (
            <Tabs.Tab key={item} selected={selected === item} onClick={() => setSelected(item)}>
              {item}
            </Tabs.Tab>
          ))}
        </Tabs>
      </div>
    );
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};
