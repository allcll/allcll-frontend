import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/app/layouts/MainLayout.tsx';
import ServiceLayout from '@/app/layouts/ServiceLayout.tsx';
import SimulationLayout from '@/app/layouts/SimulationLayout.tsx';
import Landing from '@/pages/home/Landing.tsx';
import Live from '@/pages/live/Live.tsx';
import ServiceInfo from '@/pages/serviceInfo/ServiceInfo.tsx';
import CustomerService from '@/pages/customerService/CustomerService.tsx';
import FAQ from '@/pages/faq/FAQ';
import WishTable from '@/pages/wishlist/WishTable.tsx';
import WishesDetail from '@/pages/wishlist/WishesDetail.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';
import ErrorPageWith404 from '@/pages/ErrorPageWith404.tsx';
import Simulation from '@/pages/simulation/Simulation.tsx';
import SimulationDashboard from '@/pages/simulation/Dashboard.tsx';
import SimulationDashboardDetail from '@/pages/simulation/DashboardDetail.tsx';
import Timetable from '@/pages/timetable/Timetable.tsx';
import Graduation from '@/pages/joluphaja/Graduation';
import GraduationDashboard from '@/pages/joluphaja/Dashboard.tsx';
import NotFound from '@/pages/notfound/NotFound';

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
    element: <ServiceLayout serviceId="baskets" />,
    errorElement: <ErrorPageWith404 />,
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
    element: <ServiceLayout serviceId="live" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Live />,
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
    ],
  },
  {
    path: 'timetable',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Timetable />,
      },
    ],
  },
  {
    path: 'graduation',
    element: <ServiceLayout serviceId="graduation" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Graduation />,
      },
      {
        path: 'result',
        element: <GraduationDashboard />,
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
