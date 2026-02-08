import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Dashboard from '@/pages/Dashboard';
import Clawlers from '@/pages/ClawlersSetting';
import Service from '@/pages/Service';
import Logs from '@/pages/Logs';
import Graduation from '@/pages/Graduation';

const router = createBrowserRouter([
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
    path: '*',
    element: <div>404 Not Found</div>,
  },
]);

export default router;
