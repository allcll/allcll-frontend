import { useRouteError } from 'react-router-dom';
import NotFound from '@/pages/NotFound.tsx';
import ErrorPage from '@/pages/ErrorPage.tsx';

const ErrorPageWith404 = () => {
  const error = useRouteError() as Error;

  const message404 = '"code":"NOT_FOUND"';

  if (error.message.includes(message404)) {
    return <NotFound />;
  }

  return <ErrorPage />;
};

export default ErrorPageWith404;
