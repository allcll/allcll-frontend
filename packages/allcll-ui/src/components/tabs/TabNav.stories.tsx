import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import TabNav, { TabNavItem } from './TabNav';

const SEMESTERS = ['2026-2학기', '2026-여름학기', '2026-1학기'];

const meta = {
  title: 'Navigation/TabNav',
  component: TabNav,
  subcomponents: { 'TabNav.Item': TabNavItem },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '다른 페이지로 이동하는 링크를 탭 모양으로 보여줍니다. 같은 화면 안에서 내용만 바꿀 때는 Tabs를 사용합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    fullWidth: { description: '탭을 가로로 가득 채울지 여부', control: 'boolean' },
    'aria-label': { description: '스크린 리더가 읽을 이름', control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    fullWidth: false,
    'aria-label': '학기 선택',
  },
  render: function Render(args) {
    const [selected, setSelected] = useState(SEMESTERS[0]);

    return (
      <div className="w-96">
        <TabNav {...args}>
          {SEMESTERS.map(semester => (
            <TabNav.Item
              key={semester}
              href="#"
              selected={semester === selected}
              onClick={e => {
                e.preventDefault();
                setSelected(semester);
              }}
            >
              {semester}
            </TabNav.Item>
          ))}
        </TabNav>
      </div>
    );
  },
} satisfies Meta<typeof TabNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
