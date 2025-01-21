import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard.tsx';
import App from '@/App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/courses',
    element: <Dashboard />,
  },
]);

export default router;