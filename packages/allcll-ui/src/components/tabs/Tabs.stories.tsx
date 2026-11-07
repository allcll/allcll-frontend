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
  args: {
    value: ITEMS[0],
    onValueChange: () => {},
    children: null,
  },
  render: function Render() {
    const [selected, setSelected] = useState(ITEMS[0]);

    return (
      <div className="w-80">
        <Tabs value={selected} onValueChange={setSelected}>
          <Tabs.List aria-label="분류">
            {ITEMS.map(item => (
              <Tabs.Tab key={item} value={item}>
                {item}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {ITEMS.map(item => (
            <Tabs.Panel key={item} value={item} className="p-4">
              {item} 내용
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    );
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
