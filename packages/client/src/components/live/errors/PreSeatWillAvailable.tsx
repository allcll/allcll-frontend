import NoneLayout from '@/components/live/NoneLayout.tsx';
import AlarmSVG from '@/assets/alarm-gray.svg?react';

function PreSeatWillAvailable() {
  return (
    <NoneLayout
      title="여석 알림 서비스가 종료되었습니다"
      description="추후 과목 전체 여석을 공개할 예정입니다. 공지 채팅방을 통해 알려드리겠습니다"
      icon={<AlarmSVG className="w-7 h-7" />}
    >
      <div className="flex justify-center">
        <a
          className="bg-gray-50 rounded-full px-4 py-2 text-sm border border-gray-200 hover:shadow-md cursor-pointer"
          href="https://open.kakao.com/o/g3MztXfh"
        >
          공지 채팅방 바로가기
        </a>
      </div>
    </NoneLayout>
  );
}

export default PreSeatWillAvailable;
