import CloseIcon from "@/assets/x-gray.svg?react";
import useTick from "@/hooks/useTick.ts";
import {useRemovePinned} from "@/store/usePinned.ts";
import {getTimeDiffString} from '@/utils/stringFormats.ts'
import {getSeatColor} from '@/utils/colors.ts';
import {Subject, Wishes} from "@/utils/types.ts";

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
}

function RealtimeCard({ subject, seats, queryTime, disableSeat=false }: IPinCard) {
  const {mutate: deletePin} = useRemovePinned();

  const handlePin = () => {
    deletePin(subject.subjectId);
  }

  return (
    <div className="bg-gray-50 shadow-sm rounded-lg p-4 border border-gray-200 hover:shadow-md">
      <div className="flex justify-between">
        <h3 className="font-bold">{subject.subjectName}</h3>
        <button className="p-2 rounded-full hover:bg-blue-100"
                area-label="핀 제거"
                onClick={handlePin}>
          <CloseIcon/>
        </button>
      </div>
      <div className="mb-2 text-xs text-gray-500">
        <p>{(subject as Wishes).departmentName}</p>
        <p>{subject.subjectCode}-{subject.classCode} | {subject.professorName}</p>
      </div>
      { !disableSeat && (
        <div className="flex justify-between items-baseline">
          <p className={`px-2 py-1 rounded-full text-xs font-bold ${getSeatColor(seats)}`}>여석: {seats < 0 ? "???" : seats}</p>
          <QueryTimeComponent queryTime={queryTime} />
        </div>
      )}
    </div>
  );
}

function QueryTimeComponent({ queryTime }: { queryTime?: string }) {
  useTick();

  return (
    <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p>
  );
}

export default RealtimeCard;