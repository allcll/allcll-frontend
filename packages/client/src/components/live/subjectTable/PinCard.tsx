import AlarmButton from '@/components/live/AlarmButton.tsx';
import { getTimeDiffString } from '@/utils/stringFormats.ts';
import { Subject, Wishes } from '@/utils/types.ts';
import { getSeatColor } from '@/utils/colors.ts';

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
  className?: string;
  isLive?: boolean;
}

function PinCard({ subject, seats, queryTime, disableSeat = false, className, isLive = false }: Readonly<IPinCard>) {
  const isDeleted = subject.isDeleted;
  const isEng = subject.curiLangNm === '영어';

  return (
    <div className={'bg-gray-50 shadow-sm rounded-lg p-4 ' + className}>
      <div className="flex justify-between">
        <h3 className="font-bold">{subject.subjectName}</h3>
        <AlarmButton subject={subject} />
      </div>
      <div className="mb-2 text-xs text-gray-500">
        <p>{(subject as Wishes).departmentName}</p>
        <p>
          {subject.subjectCode}-{subject.classCode} | {subject.professorName}
        </p>
      </div>
      {!disableSeat && (
        <div className="flex justify-between items-baseline">
          <p className={`text-sm px-2 py-1 rounded-full font-bold ${getSeatColor(seats)}`}>
            여석: {seats < 0 ? '???' : seats}
          </p>
          {!isLive && <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p>}
          {isDeleted && <p className={`text-xs text-gray-500`}>폐강</p>}
          {isEng && <p className={`text-xs text-gray-500`}>영어</p>}
        </div>
      )}
    </div>
  );
}

export default PinCard;
