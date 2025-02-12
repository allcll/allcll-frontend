import {createBrowserRouter} from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import Landing from '@/pages/Landing.tsx';
import Dashboard from '@/pages/Dashboard.tsx';
import SearchCourses from '@/pages/SearchCourses.tsx';
import CustomerService from '@/pages/CustomerService.tsx';
import WishTable from '@/pages/wishlist/WishTable.tsx';
import WishesDetail from '@/pages/wishlist/WishesDetail.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import NotFound from '@/pages/NotFound.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '/',
        element: <Landing/>,
      },
      {
        path: 'survey',
        element: <CustomerService/>,
      },
    ],
  },
  {
    path: 'wishes',
    element: <MainLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <WishTable/>,
      },
      {
        path: ':id',
        element: <WishesDetail/>,
      }
    ],
  },
  {
    path: 'live',
    element: <MainLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <Dashboard/>,
      },
      {
        path: 'search',
        element: <SearchCourses/>,
      }
    ],
  },
  {
    path: '*',
    element: <NotFound/>,
  }
]);

export default router;