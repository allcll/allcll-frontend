import PinIcon from '@/components/svgs/PinIcon.tsx';
import {Subject} from '@/utils/types..ts';

function PinCard({ subject }: { subject: Subject }) {
  return (
    <div className="bg-gray-50 shadow-sm rounded-lg p-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">{subject.name}</h3>
        <button area-label='핀 제거'>
          <PinIcon/>
        </button>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-500">{subject.code} | {subject.professor}</p>
        <p className={`text-sm ${seatColor(subject.seats)}`}>여석: {subject.seats}</p>
      </div>
    </div>
  );
}

function seatColor(seats: number) {
  if (seats > 5)
    return 'text-green-500';
  if (seats > 0)
    return 'text-yellow-500';
  return 'text-red-500';
}

export default PinCard;