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
        <div className="flex justify-between items-baseline ">
          <p className={`text-sm font-bold ${getSeatColor(seats)} rounded-full px-2`}>
            여석: {seats < 0 ? '???' : seats}
          </p>
          {/* <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p> */}
        </div>
      )}
    </div>
  );
}

export default PinCard;
