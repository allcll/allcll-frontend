import { useRouteError } from 'react-router-dom';
import NotFound from '@/pages/notfound/NotFound';
import ErrorPage from '@/pages/ErrorPage.tsx';
import { BadRequestError, NotFoundError } from '@/utils/errors.ts';

const ErrorPageWith404 = () => {
  const error = useRouteError();

  if (error instanceof BadRequestError || error instanceof NotFoundError) {
    return <NotFound />;
  }

  return <ErrorPage />;
};

export default ErrorPageWith404;
