import { Link } from 'react-router-dom';
import HomeSvg from '@/assets/home-white.svg?react';

import { ServiceSemester } from '@/entities/semester/api/semester.ts';
import { Button, Card, Flex, Heading, SupportingText } from '@allcll/allcll-ui';

interface IServiceClosed {
  data: ServiceSemester;
}

function ServiceClosed({ data }: IServiceClosed) {
  const isSemesterExpired = data.service?.endDate && data.service.endDate < new Date();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <main className="text-center">
        <Heading level={1}>{isSemesterExpired ? '수강신청 고생 많으셨습니다.' : '서비스 준비중입니다.'}</Heading>
        <SupportingText>
          현재는 서비스를 이용할 수 없습니다.
          <br />
          다음 수강신청 기간에 더 나은 서비스로 찾아뵙겠습니다.
        </SupportingText>

        <Card className="mt-2">
          {isSemesterExpired ? (
            <>
              <Heading level={2}>{data.semester} 수강신청이 종료되었습니다.</Heading>
              <SupportingText>
                수강 신청 기간 동안 고생 많으셨습니다.
                <br />
              </SupportingText>
              <SupportingText>자세한 일정은 추후 공지 예정입니다.</SupportingText>
            </>
          ) : (
            <>
              <Heading level={2}>다음 서비스 기간 안내</Heading>
              <SupportingText>수강신청</SupportingText>
              <SupportingText>
                {data.service?.startDateStr} ~ {data.service?.endDateStr}
              </SupportingText>
            </>
          )}

          <hr className="my-4 border-gray-200" />

          <Heading level={3}>문의</Heading>

          <SupportingText className="flex items-center justify-center gap-2 mt-2">allcllclla@google.com</SupportingText>
          <a
            className="text-gray-500 flex items-center justify-center gap-2 mt-1 hover:text-blue-500 hover:underline"
            href="https://forms.gle/bCDTVujEHunnvHe88"
            target="_blank"
          >
            오류 및 제안
          </a>
          <a
            className="text-gray-500 flex items-center justify-center gap-2 mt-1 hover:text-blue-500 hover:underline"
            href="https://open.kakao.com/o/g3MztXfh"
            target="_blank"
          >
            오픈 채팅
          </a>
        </Card>

        <Flex className="mt-6" justify="justify-center">
          <Button variant="primary" size="medium" asChild>
            <Link to="/">
              <HomeSvg className="w-4 h-4" />
              메인 페이지로 이동
            </Link>
          </Button>
        </Flex>
      </main>
    </div>
  );
}

export default ServiceClosed;
