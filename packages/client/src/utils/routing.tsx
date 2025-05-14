import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout.tsx';
import ServiceLayout from '@/layouts/ServiceLayout.tsx';
import SimulationLayout from '@/layouts/SimulationLayout.tsx';
import Landing from '@/pages/Landing.tsx';
import Dashboard from '@/pages/Dashboard.tsx';
import SearchCourses from '@/pages/SearchCourses.tsx';
import ServiceInfo from '@/pages/ServiceInfo.tsx';
import CustomerService from '@/pages/CustomerService.tsx';
import FAQ from '@/pages/FAQ.tsx';
import WishTable from '@/pages/wishlist/WishTable.tsx';
import WishesDetail from '@/pages/wishlist/WishesDetail.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import Simulation from '@/pages/simulation/Simulation.tsx';
import SimulationDashboard from '@/pages/simulation/Dashboard.tsx';
import SimulationDashboardDetail from '@/pages/simulation/DashboardDetail.tsx';
import NotFound from '@/pages/NotFound.tsx';
import DatabaseOperations from '@/pages/simulation/DatabaseOperations';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
      {
        path: 'survey',
        element: <CustomerService />,
      },
      {
        path: 'about',
        element: <ServiceInfo />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
    ],
  },
  {
    path: 'wishes',
    element: <ServiceLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <WishTable />,
      },
      {
        path: ':id',
        element: <WishesDetail />,
      },
    ],
  },
  {
    path: 'live',
    element: <ServiceLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'search',
        element: <SearchCourses />,
      },
    ],
  },
  {
    path: 'simulation',
    element: <SimulationLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Simulation />,
      },
      {
        path: 'logs',
        element: <SimulationDashboard />,
      },
      {
        path: 'logs/:runId',
        element: <SimulationDashboardDetail />,
      },
      {
        path: 'admin',
        element: <DatabaseOperations />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
