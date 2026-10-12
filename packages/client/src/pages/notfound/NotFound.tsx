import { Flex, Heading, TextLink } from '@allcll/allcll-ui';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import JumpGame from '@/widgets/jumpGame/ui/JumpGame.tsx';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>ALLCLL | 페이지를 찾을 수 없습니다</title>
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
          <Heading level={1}>404 - 페이지를 찾을 수 없습니다</Heading>
          <p className="text-lg mb-4">현재 페이지는 존재하지 않습니다</p>
          <TextLink asChild>
            <Link to="/">홈으로 돌아가기</Link>
          </TextLink>
        </Flex>
      </Flex>
    </>
  );
};

export default NotFound;
