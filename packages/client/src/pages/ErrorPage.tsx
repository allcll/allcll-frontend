import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  useEffect(() => {
    Sentry.captureException(error, {
      extra: {
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    });
  }, [error]);

  return (
    <>
      <Helmet>
        <title>ALLCLL | 오류가 발생했습니다</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">오류가 발생했습니다</h1>
        <p className="text-lg mb-4">문제가 발생했어요. 잠시 기다렸다 다시 시도해보세요</p>
        <Link to="/" className="text-blue-500">
          홈으로 돌아가기
        </Link>
        <a href="https://forms.gle/bCDTVujEHunnvHe88" target="_blank" className="text-blue-500">
          문의하기
        </a>
      </div>
    </>
  );
};

export default ErrorPage;
