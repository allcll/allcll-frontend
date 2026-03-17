import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/app/layouts/MainLayout.tsx';
import ServiceLayout from '@/app/layouts/ServiceLayout.tsx';
const SimulationLayout = lazy(() => import('@/app/layouts/SimulationLayout.tsx'));
import ErrorPage from '@/pages/ErrorPage.tsx';
import ErrorPageWith404 from '@/pages/ErrorPageWith404.tsx';
import PageLoader from '@/shared/ui/PageLoader.tsx';

const Landing = lazy(() => import('@/pages/home/Landing.tsx'));
const Live = lazy(() => import('@/pages/live/Live.tsx'));
const ServiceInfo = lazy(() => import('@/pages/serviceInfo/ServiceInfo.tsx'));
const CustomerService = lazy(() => import('@/pages/customerService/CustomerService.tsx'));
const FAQ = lazy(() => import('@/pages/faq/FAQ'));
const WishTable = lazy(() => import('@/pages/wishlist/WishTable.tsx'));
const WishesDetail = lazy(() => import('@/pages/wishlist/WishesDetail.tsx'));
const Simulation = lazy(() => import('@/pages/simulation/Simulation.tsx'));
const SimulationDashboard = lazy(() => import('@/pages/simulation/Dashboard.tsx'));
const SimulationDashboardDetail = lazy(() => import('@/pages/simulation/DashboardDetail.tsx'));
const Timetable = lazy(() => import('@/pages/timetable/Timetable.tsx'));
const GraduationSettingSteps = lazy(() => import('@/pages/graduation/SettingSteps.tsx'));
const GraduationDashboard = lazy(() => import('@/pages/graduation/Dashboard.tsx'));
const NotFound = lazy(() => import('@/pages/notfound/NotFound'));
const PrivacyPolicy = lazy(() => import('@/pages/user/PrivacyPolicy'));

function page(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: page(Landing),
        },
        {
          path: 'survey',
          element: page(CustomerService),
        },
        {
          path: 'about',
          element: page(ServiceInfo),
        },
        {
          path: 'faq',
          element: page(FAQ),
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
          element: page(WishTable),
        },
        {
          path: ':id',
          element: page(WishesDetail),
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
          element: page(Live),
        },
      ],
    },

    {
      path: 'simulation',
      element: (
        <Suspense fallback={<PageLoader />}>
          <SimulationLayout />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: page(Simulation),
        },
        {
          path: 'logs',
          element: page(SimulationDashboard),
        },
        {
          path: 'logs/:runId',
          element: page(SimulationDashboardDetail),
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
          element: page(Timetable),
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
          element: page(GraduationSettingSteps),
        },
        {
          path: 'result',
          element: page(GraduationDashboard),
        },
      ],
    },
    {
      path: 'privacy-policy',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: page(PrivacyPolicy),
        },
      ],
      errorElement: <ErrorPage />,
    },

    {
      path: '*',
      element: page(NotFound),
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default router;
