import AlarmButton from '@/components/live/AlarmButton.tsx';
import { Subject, Wishes } from '@/utils/types.ts';
import { getSeatColor } from '@/utils/colors.ts';

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
  className?: string;
}

function PinCard({ subject, seats, disableSeat = false, className }: Readonly<IPinCard>) {
  const isEng = subject.curiLangNm === '영어';
  const isDeleted = subject.isDeleted;
  const bgColor = isDeleted
    ? 'bg-gray-100 hover:bg-gray-200'
    : isEng
      ? 'bg-green-50 hover:bg-green-100'
      : 'bg-white hover:bg-gray-100';

  return (
    <div className={`${bgColor} shadow-sm rounded-lg p-4 ` + className}>
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
        <div className="flex justify-between items-baseline ">
          <p className={`text-sm font-bold ${getSeatColor(seats)} rounded-full px-2`}>
            여석: {seats < 0 ? '-' : seats}
          </p>
          {/* <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p> */}
        </div>
      )}
    </div>
  );
}

export default PinCard;
