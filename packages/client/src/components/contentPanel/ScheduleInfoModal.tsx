import useScheduleModal from '@/hooks/useScheduleModal';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import XDarkGraySvg from '@/assets/x-darkgray.svg?react';
import ClockGraySvg from '@/assets/clock-gray.svg?react';
import HouseSvg from '@/assets/house.svg?react';

function ScheduleInfoModal() {
  const { schedule, deleteSchedule } = useScheduleModal();
  const { closeBottomSheet } = useBottomSheetStore();

  const handleDeleteOfficialSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = confirm('해당 과목을 삭제하시겠습니까?');
    if (!confirmed) return;

    deleteSchedule(e);
  };

  return (
    <div className="fixed inset-0 z-50  hidden md:flex items-center justify-center  bg-black/10">
      <div
        className="bg-white flex flex-col border border-gray-200 rounded-xl gap-2 w-[90%] max-w-md p-8 shadow-xl relative"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex w-full justify-between">
          <h3 className="font-semibold text-lg">{schedule.subjectName}</h3>
          <button
            className="w-6 h-6 cursor-pointer flex items-center justify-center bg-gray-100 rounded-full"
            onClick={() => closeBottomSheet()}
          >
            <XDarkGraySvg />
          </button>
        </div>

        <p className="text-sm text-gray-500">{schedule.professorName}</p>
        <div className="flex items-center gap-1">
          <ClockGraySvg className="w-4 h-4 " />
          {schedule.timeSlots.map(slot => {
            return (
              <span className="text-gray-500 text-sm">
                {slot.dayOfWeeks} {slot.startTime} ~ {slot.endTime}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <HouseSvg className="w-4 h-4 " />
          <span className="text-gray-500 text-sm">{schedule.location}</span>
        </div>
        <div className="px-4 py-4">
          <button
            onClick={handleDeleteOfficialSchedule}
            className="text-sm text-red-500 cursor-pointer font-medium ml-auto block"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleInfoModal;
