import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useRouteError } from 'react-router-dom';
import { Button, Flex, Heading, SupportingText } from '@allcll/allcll-ui';
import JumpGame from '@/widgets/jumpGame/ui/JumpGame.tsx';

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

      <Flex
        direction="flex-col"
        align="items-center"
        justify="justify-center"
        gap="gap-6"
        className="min-h-screen px-4 py-8"
      >
        <JumpGame />

        <Flex direction="flex-col" align="items-center" gap="gap-2">
          <Heading level={1}>문제가 발생했습니다</Heading>
          <SupportingText>화면을 다시 불러오면 해결되는 경우가 많습니다.</SupportingText>

          <Button variant="primary" size="medium" className="mt-2" onClick={() => window.location.reload()}>
            다시 시도
          </Button>

          <Flex gap="gap-4" className="mt-2">
            <Link to="/" className="text-blue-500">
              홈으로 돌아가기
            </Link>
            <a href="https://forms.gle/bCDTVujEHunnvHe88" target="_blank" className="text-blue-500">
              문의하기
            </a>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ErrorPage;
