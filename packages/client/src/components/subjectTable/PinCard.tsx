import PinIcon from '@/components/svgs/PinIcon.tsx';
import {Subject} from '@/utils/types..ts';
import {usePinned, useAddPinned, useRemovePinned} from "@/store/usePinned.ts";

interface IPinCard {
  subject: Subject;
  seats: number;
}

function PinCard({ subject, seats }: IPinCard) {
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
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">{subject.subjectName}</h3>
        <button area-label='핀 제거' onClick={handlePin}>
          <PinIcon disabled={!isPinned}/>
        </button>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">{subject.subjectCode} | {subject.professorName}</p>
        <p className={`text-sm ${seatColor(seats)}`}>여석: {seats < 0 ? "???" : seats}</p>
      </div>
    </div>
  );
}

function seatColor(seats: number) {
  if (seats > 5)
    return 'text-green-500';
  if (seats > 0)
    return 'text-yellow-500';
  if (seats == 0)
    return 'text-red-500';

  return 'text-gray-500';
}

export default PinCard;