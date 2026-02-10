import NoneLayout from '@/shared/ui/NoneLayout';
import AlarmSVG from '@/assets/alarm.svg?react';
import { Flex } from '@allcll/allcll-ui';
import useServiceSemester from '@/entities/semester/model/useServiceSemester';

function PreSeatWillAvailable() {
  const { data } = useServiceSemester('live');

  const endedService = data && 'service' in data && data.service && !data.service.withinPeriod ? data.service : null;

  if (!endedService) {
    return (
      <NoneLayout
        title="수강 신청이 종료되었습니다."
        description="수강 신청이 시작되면 실시간 좌석 현황을 확인할 수 있어요."
        icon={<AlarmSVG className="w-7 h-7 text-gray-400" />}
      />
    );
  }

  return (
    <NoneLayout
      title="수강 정정 기간이 종료되었습니다"
      description={`수강 신청 고생 많으셨습니다. 다음 학기에 만나요.`}
      icon={<AlarmSVG className="w-7 h-7 text-gray-400" />}
    >
      <Flex justify="justify-center">
        <a
          className="bg-gray-50 rounded-full px-4 py-2 text-sm border border-gray-200 hover:shadow-md cursor-pointer"
          href="https://open.kakao.com/o/g3MztXfh"
        >
          공지 채팅방 바로가기
        </a>
      </Flex>
    </NoneLayout>
  );
}

export default PreSeatWillAvailable;
