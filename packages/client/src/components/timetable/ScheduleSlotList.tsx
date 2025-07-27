import { useScheduleState } from '@/store/useScheduleState.ts';
import { Schedule, useTimetableSchedules, getEmptyScheduleSlots } from '@/hooks/server/useTimetableSchedules.ts';

function ScheduleSlotList() {
  const currentTimetable = useScheduleState(s => s.currentTimetable);

  const { data: schedules } = useTimetableSchedules(currentTimetable?.timeTableId);
  const scheduleSlots: Schedule[] = getEmptyScheduleSlots(schedules);

  console.log('ScheduleSlotList', scheduleSlots);

  return (
    /* 새로운 일정에 대한 컴포넌트 */
    /* 수정 + 기존 일정 컴포넌트 */
    <></>
  );
}

export default ScheduleSlotList;
