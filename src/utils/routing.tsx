import { createBrowserRouter } from 'react-router-dom';
import CourseList from '@/pages/CourseList';
import App from '@/App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/courses',
    element: <CourseList />,
  },
]);

export default router;