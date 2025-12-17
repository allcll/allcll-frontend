import { Flex, Heading } from '@allcll/allcll-ui';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 페이지를 찾을 수 없습니다</title>
      </Helmet>

      <Flex direction="flex-col" align="items-center" justify="justify-center" gap="gap-2" className="h-screen">
        <Heading level={1}>404 - 페이지를 찾을 수 없습니다</Heading>
        <p className="text-lg mb-4">현재 페이지는 존재하지 않습니다</p>
        <Link to="/" className="text-blue-500">
          홈으로 돌아가기
        </Link>
      </Flex>
    </>
  );
};

export default NotFound;
