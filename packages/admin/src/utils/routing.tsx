import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Dashboard from '@/pages/Dashboard';
import Clawlers from '@/pages/ClawlersSetting';
import Service from '@/pages/Service';
import Logs from '@/pages/Logs';
import Graduation from '@/pages/Graduation';
import Reviews from '@/pages/Reviews';
import Notices from '@/pages/Notices';
import NoticeEditor from '@/pages/NoticeEditor';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <Dashboard />,
        },
      ],
    },
    {
      path: '/clawlers',
      element: <MainLayout />,
      children: [
        {
          path: '/clawlers',
          element: <Clawlers />,
        },
      ],
    },
    {
      path: '/graduation',
      element: <MainLayout />,
      children: [
        {
          path: '/graduation',
          element: <Graduation />,
        },
      ],
    },
    {
      path: '/service',
      element: <MainLayout />,
      children: [
        {
          path: '/service',
          element: <Service />,
        },
      ],
    },
    {
      path: '/logs',
      element: <MainLayout />,
      children: [
        {
          path: '/logs',
          element: <Logs />,
        },
      ],
    },
    {
      path: '/reviews',
      element: <MainLayout />,
      children: [
        {
          path: '/reviews',
          element: <Reviews />,
        },
      ],
    },
    {
      path: '/notices',
      element: <MainLayout />,
      children: [
        {
          path: '/notices',
          element: <Notices />,
        },
      ],
    },
    {
      path: '/notices/new',
      element: <MainLayout />,
      children: [
        {
          path: '/notices/new',
          element: <NoticeEditor />,
        },
      ],
    },
    {
      path: '/notices/edit/:id',
      element: <MainLayout />,
      children: [
        {
          path: '/notices/edit/:id',
          element: <NoticeEditor />,
        },
      ],
    },
    {
      path: '*',
      element: <div>404 Not Found</div>,
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default router;
