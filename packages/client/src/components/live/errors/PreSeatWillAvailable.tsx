import NoneLayout from '@/components/live/NoneLayout.tsx';
import AlarmSVG from '@/assets/alarm-gray.svg?react';

function PreSeatWillAvailable() {
  return (
    <NoneLayout
      title="수강 정정 기간이 종료되었습니다"
      description="수강 신청 고생 많으셨습니다. 다음 학기에 만나요."
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
