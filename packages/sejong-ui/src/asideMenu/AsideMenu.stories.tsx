import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { IMenu } from './types';
import AsideMenu from './index';

const meta = {
  title: 'SejongUI/AsideMenu',
  component: AsideMenu,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <MemoryRouter initialEntries={['/simulation']}>
        <div style={{ display: 'flex', height: '100vh' }}>
          <Story />
          <main style={{ padding: '1rem', width: '100%' }}>
            <Routes>
              <Route path="/simulation" element={<h1>수강신청 페이지</h1>} />
              <Route path="/simulation/logs" element={<h1>수강신청 결과 페이지</h1>} />
              <Route path="/simulation/admin" element={<h1>수강신청 관리 페이지</h1>} />
            </Routes>
          </main>
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AsideMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMenus: IMenu[] = [
  {
    name: '수강 및 변동신청',
    children: [
      {
        name: '수강신청 및 기타',
        children: [
          { name: '수강신청', path: '/simulation' },
          { name: '수강신청 결과', path: '/simulation/logs' },
          { name: '수강신청 관리', path: '/simulation/admin' },
          { name: '관심과목 담기', path: '#' },
          { name: '강의시간표/수업계획서 조회', path: '#' },
        ],
      },
      {
        name: '다른 메뉴',
        children: [{ name: '다른 페이지', path: '/other' }],
      },
    ],
  },
  {
    name: '단일 메뉴',
    path: '/single',
  },
];

export const Default: Story = {
  args: {
    menus: sampleMenus,
  },
};
