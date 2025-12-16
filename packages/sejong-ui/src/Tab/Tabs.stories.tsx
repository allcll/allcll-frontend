import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { type ITab } from './index';
import Tab from '@/Tab/Tab.tsx';

const meta = {
  title: 'SejongUI/Tab',
  component: Tab,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs: ITab[] = [
  { title: '수강신청', urlPath: '/simulation', realUrl: '/simulation' },
  { title: '수강신청 결과', urlPath: '/simulation/logs', realUrl: '/simulation/logs' },
  { title: '수강신청 관리', urlPath: '/simulation/admin', realUrl: '/simulation/admin' },
];

interface ITabProps {
  tabList: ITab[];
  initialTabs?: ITab[];
}

const AppLayout = ({ tabList, initialTabs }: ITabProps) => (
  <>
    <Tab tabList={tabList} initialTabs={initialTabs} />
    <main style={{ padding: '1rem' }}>
      <Routes>
        <Route path="/simulation" element={<h1>수강신청 페이지</h1>} />
        <Route path="/simulation/logs" element={<h1>수강신청 결과 페이지</h1>} />
        <Route path="/simulation/admin" element={<h1>수강신청 관리 페이지</h1>} />
        <Route path="/" element={<h1>홈 페이지</h1>} />
      </Routes>
    </main>
  </>
);

export const Default: Story = {
  args: {
    tabList: sampleTabs,
    initialTabs: sampleTabs,
  },
  render: () => (
    <MemoryRouter initialEntries={['/simulation']}>
      <AppLayout tabList={sampleTabs} initialTabs={sampleTabs} />
    </MemoryRouter>
  ),
};

export const WithNoTabs: Story = {
  args: {
    tabList: sampleTabs,
  },
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <AppLayout tabList={[]} />
    </MemoryRouter>
  ),
};
