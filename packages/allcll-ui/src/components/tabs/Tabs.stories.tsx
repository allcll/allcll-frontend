import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs, { TabsList } from './Tabs';

const ITEMS = ['전공', '교양', '졸업인증'];

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  subcomponents: { 'Tabs.List': TabsList },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '같은 화면 안에서 내용을 바꿔 보여주는 탭입니다. 주소가 바뀌는 페이지 이동에는 TabNav를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: { description: '선택된 탭 값', control: false },
    onValueChange: { description: '탭을 바꿀 때 호출하는 함수', control: false },
    children: { description: '`Tabs.List`, `Tabs.Tab`, `Tabs.Panel` 조합', control: false },
    className: { table: { disable: true } },
  },
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

export const Playground: Story = {};
