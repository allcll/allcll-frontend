import BottomSheet from './BottomSheet';
import BottomSheetHeader from './BottomSheetHeader';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';
import useScheduleModal from '@/hooks/useScheduleModal';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';

function ScheduleInfoBottomSheet() {
  const { schedule, deleteSchedule } = useScheduleModal();
  const { closeBottomSheet } = useBottomSheetStore();

  const handleDeleteOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm('해당 과목을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteSchedule(e);
  };

  return (
    <BottomSheet>
      <BottomSheetHeader headerType="close" onClose={() => closeBottomSheet()} />
      <div className="w-full flex items-center gap-2 border-b border-gray-200 p-2 h-12">
        <h3 className="font-semibold text-md">{schedule.subjectName}</h3>
      </div>

      <div className="flex flex-col gap-1 px-2 py-3 text-gray-500 text-sm">
        <p className="text-sm text-gray-500">{schedule.professorName}</p>
        <div className="flex items-center gap-1">
          <ClockGraySvg className="w-4 h-4 text-gray-400" />
          {schedule.timeSlots.map(slot => {
            return (
              <span className="text-gray-500 text-sm">
                {slot.dayOfWeeks} {slot.startTime} ~ {slot.endTime}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <HouseSvg className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500 text-sm">{schedule.location}</span>
        </div>
      </div>
      <div className="px-4 py-4">
        <button
          onClick={handleDeleteOfficialSchedule}
          className="text-sm text-red-500 cursor-pointer font-medium ml-auto block"
        >
          삭제
        </button>
      </div>
    </BottomSheet>
  );
}

export default ScheduleInfoBottomSheet;
