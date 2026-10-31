import { Button, Flex, Heading, SupportingText, TextLink } from '@allcll/allcll-ui';
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
          <SupportingText>현재 페이지는 존재하지 않습니다</SupportingText>

          <Button asChild variant="solid" size="medium" className="mt-2">
            <Link to="/">홈으로 돌아가기</Link>
          </Button>

          <Flex gap="gap-4" className="mt-4 text-sm">
            <TextLink href="https://forms.gle/bCDTVujEHunnvHe88" target="_blank">
              문의하기
            </TextLink>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default NotFound;
