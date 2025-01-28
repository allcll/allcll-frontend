import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Landing from '@/pages/Landing.tsx';
import Dashboard from '@/pages/Dashboard.tsx';
import SearchCourses from '@/pages/SearchCourses.tsx';
import CustomerService from '@/pages/CustomerService.tsx';


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
      },
      {
        path: '/survey',
        element: <CustomerService />,
      },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export default router;