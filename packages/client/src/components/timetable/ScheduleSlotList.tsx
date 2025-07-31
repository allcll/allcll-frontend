import { useScheduleState } from '@/store/useScheduleState.ts';
import { useTimetableSchedules, getEmptyScheduleSlots, GeneralSchedule } from '@/hooks/server/useTimetableSchedules.ts';
import XGraySvg from '@/assets/x-darkgray.svg?react';
import useScheduleModal from '@/hooks/useScheduleModal.ts';

function ScheduleSlotList() {
  const currentTimetable = useScheduleState(s => s.currentTimetable);

  const { data: schedules } = useTimetableSchedules(currentTimetable?.timeTableId);
  const scheduleSlots = getEmptyScheduleSlots(schedules);

  return (
    <div className="flex flex-col gap-2 mt-3">
      {scheduleSlots
        // .filter(schedule => !schedule.selected)
        .map(schedule => (
          <EmptyScheduleSlot schedule={schedule} selected={schedule.selected} />
        ))}
    </div>
  );
}

function EmptyScheduleSlot({ schedule, selected }: { schedule: GeneralSchedule; selected: boolean }) {
  const { openScheduleModal } = useScheduleModal();

  const handleDeleteEmptySlot = () => {
    openScheduleModal(schedule);
  };

  return (
    <div
      key={schedule.scheduleId}
      className={
        'h-10 w-full p-4 flex justify-between items-center rounded border ' +
        (selected ? 'bg-blue-100 border-blue-500' : 'border-gray-200')
      }
    >
      <div className="flex gap-5">
        <p>{schedule.subjectName}</p>
        <p className="text-stone-400">{schedule.professorName}</p>
      </div>
      <button type="button" onClick={handleDeleteEmptySlot} className="cursor-pointer">
        <XGraySvg className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ScheduleSlotList;
