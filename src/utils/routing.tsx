import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Landing from '@/pages/Landing.tsx';
import Dashboard from '@/pages/Dashboard.tsx';
import SearchCourses from '@/pages/SearchCourses.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: '/courses',
        element: <Dashboard />,
      },
      {
        path: '/search',
        element: <SearchCourses/>,
      }
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export default router;