import { createBrowserRouter } from 'react-router-dom';
import MainLayout from "@/layouts/MainLayout.tsx";
import App from "@/App.tsx";


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <App />,
      }
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export default router;