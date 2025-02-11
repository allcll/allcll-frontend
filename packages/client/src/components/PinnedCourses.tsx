import {Link} from 'react-router-dom';
import PinCard from '@/components/subjectTable/PinCard.tsx';
import {usePinned} from '@/store/usePinned.ts';
import {SSEType, useSseData} from '@/hooks/useSSEManager.ts';
import NetworkError from "@/components/dashboard/errors/NetworkError.tsx";
import ZeroPinError from "@/components/dashboard/errors/ZeroPinError.tsx";

const PinnedCourses = () => {
  const {data, isPending, isError, refetch} = usePinned();
  const {data: pinnedSeats} = useSseData(SSEType.PINNED);

  const getSeats = (subjectId: number) => {
    if (!pinnedSeats) return -1;

    const pinned = pinnedSeats?.find((pinnedSeat) => pinnedSeat.subjectId === subjectId);
    return pinned?.seat ?? -1;
  }

  return (
    <div>
      <div className="flex justify-between align-baseline">
        <h2 className="font-bold text-lg mb-4">핀 고정된 과목</h2>
        <Link to="/live/search" className="text-blue-500 font-bold mt-4 hover:text-blue-600">+ 핀 과목 추가</Link>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        여석이 생기면 알림을 보내드려요 <br/>
        <span className="text-red-500 font-bold">* 탭을 닫으면 알림이 울리지 않아요</span>
      </p>


        {isPending ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 0, 0].map((_, idx) => (
              <div key={idx} className="bg-gray-300 shadow-sm rounded-lg p-4 h-24"/>
            ))}
          </div>
        ) : isError ? (
          <NetworkError onReload={refetch}/>
        ) : !data || data.length === 0 ? (
          <ZeroPinError/>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((subject) => (
              <PinCard key={`${subject.subjectId}_${subject.subjectCode}_${subject.professorName}`}
                       subject={subject}
                       seats={getSeats(subject.subjectId)}/>
            ))}
          </div>
        )}
    </div>
  );
};

export default PinnedCourses;
