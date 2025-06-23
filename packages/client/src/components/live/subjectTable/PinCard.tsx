import AlarmIcon from '@/components/svgs/AlarmIcon.tsx';
import { usePinned, useAddPinned, useRemovePinned } from '@/store/usePinned.ts';
import { getTimeDiffString } from '@/utils/stringFormats.ts';
import { Subject, Wishes } from '@/utils/types.ts';
import { getSeatColor } from '@/utils/colors.ts';

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
}

function PinCard({ subject, seats, queryTime, disableSeat = false }: Readonly<IPinCard>) {
  const { data: pinnedSubjects } = usePinned();
  const { mutate: deletePin } = useRemovePinned();
  const { mutate: addPin } = useAddPinned();

  const isPinned = pinnedSubjects?.some(pinnedSubject => pinnedSubject.subjectId === subject.subjectId);

  const handlePin = () => {
    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);
  };

  return (
    <div className="bg-gray-50 shadow-sm rounded-lg p-4">
      <div className="flex justify-between">
        <h3 className="font-bold">{subject.subjectName}</h3>
        <button aria-label="알림 과목 제거" onClick={handlePin}>
          <AlarmIcon disabled={!isPinned} />
        </button>
      </div>
      <div className="mb-2 text-xs text-gray-500">
        <p>{(subject as Wishes).departmentName}</p>
        <p>
          {subject.subjectCode}-{subject.classCode} | {subject.professorName}
        </p>
      </div>
      {!disableSeat && (
        <div className="flex justify-between items-baseline">
          <p className={`text-sm font-bold ${getSeatColor(seats)}`}>여석: {seats < 0 ? '???' : seats}</p>
          <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p>
        </div>
      )}
    </div>
  );
}

export default PinCard;
