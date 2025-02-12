import PinIcon from "@/components/svgs/PinIcon.tsx";
import {Subject, Wishes} from "@/utils/types.ts";
import {usePinned, useAddPinned, useRemovePinned} from "@/store/usePinned.ts";
import {getTimeDiffString} from '@/components/RealtimeTable.tsx';

interface IPinCard {
  subject: Subject | Wishes;
  seats: number;
  queryTime?: string;
  disableSeat?: boolean;
}

function PinCard({ subject, seats, queryTime, disableSeat=false }: IPinCard) {
  const {data: pinnedSubjects} = usePinned();
  const {mutate: deletePin} = useRemovePinned();
  const {mutate: addPin} = useAddPinned();

  const isPinned = pinnedSubjects?.some((pinnedSubject) => pinnedSubject.subjectId === subject.subjectId);

  const handlePin = () => {
    if (!isPinned) {
      addPin(subject.subjectId);
      return;
    }

    deletePin(subject.subjectId);
  }

  return (
    <div className="bg-gray-50 shadow-sm rounded-lg p-4">
      <div className="flex justify-between">
        <h3 className="font-bold">{subject.subjectName}</h3>
        <button area-label="핀 제거" onClick={handlePin}>
          <PinIcon disabled={!isPinned}/>
        </button>
      </div>
      <div className="mb-2 text-xs text-gray-500">
        <p>{(subject as Wishes).departmentName}</p>
        <p>{subject.subjectCode}-{subject.classCode} | {subject.professorName}</p>
      </div>
      { !disableSeat && (
        <div className="flex justify-between items-baseline">
          <p className={`text-sm font-bold ${seatColor(seats)}`}>여석: {seats < 0 ? "???" : seats}</p>
          <p className={`text-xs text-gray-500`}>{getTimeDiffString(queryTime)}</p>
        </div>
      )}
    </div>
  );
}

function seatColor(seats: number) {
  if (seats > 5)
    return "text-green-500";
  if (seats > 0)
    return "text-yellow-500";
  if (seats == 0)
    return "text-red-500";

  return "text-gray-500";
}

export default PinCard;