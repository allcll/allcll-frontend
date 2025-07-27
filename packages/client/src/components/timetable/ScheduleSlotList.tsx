import { useScheduleState } from '@/store/useScheduleState.ts';
import { useTimetableSchedules, getEmptyScheduleSlots } from '@/hooks/server/useTimetableSchedules.ts';
import XGraySvg from '@/assets/x-darkgray.svg?react';
function ScheduleSlotList() {
  const currentTimetable = useScheduleState(s => s.currentTimetable);

  const { data: schedules } = useTimetableSchedules(currentTimetable?.timeTableId);
  const scheduleSlots = getEmptyScheduleSlots(schedules);

  const handleDeleteEmptySlot = () => {
    //시간표 삭제 로직
  };

  /* 새로운 일정에 대한 컴포넌트 */
  /* 수정 + 기존 일정 컴포넌트 */
  return (
    <div className="flex flex-col gap-2 mt-3">
      {scheduleSlots
        .filter(schedule => !schedule.selected)
        .map(schedule => (
          <div
            key={schedule.scheduleId}
            className="w-full p-4 items-center rounded border border-gray-200 h-10 flex justify-between"
          >
            <div className="flex gap-5">
              <p>{schedule.subjectName}</p>
              <p className="text-stone-400">{schedule.professorName}</p>
            </div>
            <button type="button" onClick={handleDeleteEmptySlot} className="cursor-pointer">
              <XGraySvg className="w-5 h-5" />
            </button>
          </div>
        ))}
    </div>
  );
}

export default ScheduleSlotList;
