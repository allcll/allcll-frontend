import {Link} from 'react-router-dom';
import RealtimeCard from '@/components/subjectTable/RealtimeCard.tsx';
import NetworkError from "@/components/dashboard/errors/NetworkError.tsx";
import ZeroPinError from "@/components/dashboard/errors/ZeroPinError.tsx";
import {usePinned} from '@/store/usePinned.ts';
import useFindWishes from "@/hooks/useFindWishes.ts";
import {SSEType, useSseData} from '@/hooks/useSSEManager.ts';
import useNotification from '@/hooks/useNotification.ts';
import AlarmBlueIcon from '@/assets/alarm-blue.svg?react';
import AlarmDisabledIcon from '@/assets/alarm-disabled.svg?react';
import AddBlueIcon from '@/assets/add-blue.svg?react';
import Tooltip from "@/components/common/Tooltip.tsx";

const PinnedCourses = () => {
  const {data, isPending, isError, refetch} = usePinned();
  const {data: pinnedSeats} = useSseData(SSEType.PINNED);
  const pinnedWishes = useFindWishes(data?.map(pinned => pinned.subjectId) ?? []);

  const {isAlarm, changeAlarm} = useNotification();

  const getSeats = (subjectId: number) => {
    if (!pinnedSeats) return -1;

    const pinned = pinnedSeats?.find((pinnedSeat) => pinnedSeat.subjectId === subjectId);
    return pinned?.seatCount ?? -1;
  }

  const getQueryTime = (subjectId: number) => {
    if (!pinnedSeats) return "";

    const pinned = pinnedSeats?.find((pinnedSeat) => pinnedSeat.subjectId === subjectId);
    return pinned?.queryTime ?? "";
  }

  return (
    <div>
      <div className="flex justify-between align-top">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="font-bold text-lg">여석 과목 알림</h2>
          <Tooltip>
            <p className="text-sm">
              여석이 생기면 알림을 보내드려요 <br/>
              <span className="text-red-500">* 탭을 닫으면 알림이 울리지 않아요</span>
            </p>
          </Tooltip>
        </div>
        <div className="flex gap-1 items-center">
          <button className="p-2 rounded-full hover:bg-blue-100"
                  aria-label={isAlarm ? "알림 끄기" : "알림 켜기"}
                  title={isAlarm ? "알림 끄기" : "알림 켜기"}
                  onClick={changeAlarm}>
            {isAlarm ? <AlarmBlueIcon className="w-5 h-5"/> : <AlarmDisabledIcon className="w-5 h-5"/>}
          </button>
          <Link to="/live/search" className="p-2 rounded-full hover:bg-blue-100" aria-label="여석 알림 과목 추가" title="여석 알림 과목 추가">
            <AddBlueIcon className="w-5 h-5"/>
          </Link>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2">
        검색중 표시는 최대 5분까지 나올 수 있어요. <br/>
        만약 검색중이 계속 사라지지 않는다면 새로고침을 해주세요.
      </p>


        {isPending ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 0, 0].map((_, idx) => (
              <div key={idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24"/>
            ))}
          </div>
        ) : isError ? (
          <NetworkError onReload={refetch}/>
        ) : !pinnedWishes || pinnedWishes.length === 0 ? (
          <ZeroPinError/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pinnedWishes.map((subject) => (
              <RealtimeCard key={`${subject.subjectId}_${subject.subjectCode}_${subject.professorName}`}
                            subject={subject}
                            seats={getSeats(subject.subjectId)} queryTime={getQueryTime(subject.subjectId)}/>
            ))}
          </div>
        )}
    </div>
  );
};

export default PinnedCourses;
