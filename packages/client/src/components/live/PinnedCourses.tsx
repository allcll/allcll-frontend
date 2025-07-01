import { useState } from 'react';
import Tooltip from '@/components/common/Tooltip.tsx';
import AlarmOptionModal from '@/components/toast/AlarmOptionModal.tsx';
import RealtimeCard from '@/components/live/subjectTable/RealtimeCard.tsx';
import NetworkError from '@/components/live/errors/NetworkError.tsx';
import ZeroPinError from '@/components/live/errors/ZeroPinError.tsx';
import { usePinned } from '@/store/usePinned.ts';
import useFindWishes from '@/hooks/useFindWishes.ts';
import { SSEType, useSseData } from '@/hooks/useSSEManager.ts';
import useNotification from '@/hooks/useNotification.ts';
import AlarmBlueIcon from '@/assets/alarm-blue.svg?react';
import AlarmDisabledIcon from '@/assets/alarm-disabled.svg?react';
import SettingSvg from '@/assets/settings.svg?react';
import AlarmButton from './AlarmButton.tsx';

const PinnedCourses = () => {
  const [isAlarmSettingOpen, setIsAlarmSettingOpen] = useState(false);
  const { isAlarm, changeAlarm } = useNotification();

  return (
    <>
      <AlarmOptionModal isOpen={isAlarmSettingOpen} close={() => setIsAlarmSettingOpen(false)} />
      <div>
        <div className="flex justify-between align-top">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="font-bold text-lg">여석 과목 알림</h2>
            <Tooltip>
              <p className="text-sm">
                여석이 생기면 알림을 보내드려요 <br />
                <span className="text-red-500">* 탭을 닫으면 알림이 울리지 않아요</span>
              </p>
            </Tooltip>
          </div>
          <div className="flex gap-1 items-center">
            <button
              className="p-2 rounded-full hover:bg-blue-100"
              aria-label="알림 설정"
              title="알림 설정"
              onClick={() => setIsAlarmSettingOpen(true)}
            >
              <SettingSvg className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-full hover:bg-blue-100"
              aria-label={isAlarm ? '알림 끄기' : '알림 켜기'}
              title={isAlarm ? '알림 끄기' : '알림 켜기'}
              onClick={changeAlarm}
            >
              {isAlarm ? <AlarmBlueIcon className="w-5 h-5" /> : <AlarmDisabledIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <CoursesArea />
      </div>
    </>
  );
};

function CoursesArea() {
  const { data, isPending, isError, refetch } = usePinned();
  const { data: pinnedSeats } = useSseData(SSEType.PINNED);

  const pinnedWishes = useFindWishes(data?.map(pinned => pinned.subjectId) ?? []);

  const getSeats = (subjectId: number) => {
    const pinned = pinnedSeats?.find(pinnedSeat => pinnedSeat.subjectId === subjectId);
    return pinned?.seatCount ?? -1;
  };

  const getQueryTime = (subjectId: number) => {
    const pinned = pinnedSeats?.find(pinnedSeat => pinnedSeat.subjectId === subjectId);
    return pinned?.queryTime ?? '';
  };

  if (isPending) {
    return (
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 0, 0].map((_, idx) => (
          <div key={'skeleton-card-' + idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <NetworkError onReload={refetch} />;
  }

  if (!pinnedWishes || pinnedWishes.length === 0) {
    return <ZeroPinError />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pinnedWishes.map(subject => (
        <RealtimeCard
          key={`${subject.subjectId}_${subject.subjectCode}_${subject.professorName}`}
          subject={subject}
          seats={getSeats(subject.subjectId)}
          queryTime={getQueryTime(subject.subjectId)}
        />
      ))}
      {pinnedWishes.length < 5 && <AlarmButton />}
    </div>
  );
}

export default PinnedCourses;
