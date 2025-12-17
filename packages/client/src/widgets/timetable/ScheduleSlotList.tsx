import { useScheduleState } from '@/store/useScheduleState.ts';
import {
  useTimetableSchedules,
  getEmptyScheduleSlots,
  GeneralSchedule,
} from '@/entities/timetable/api/useTimetableSchedules.ts';
import XGraySvg from '@/assets/x-darkgray.svg?react';
import useScheduleModal from '@/hooks/useScheduleModal.ts';
import { Flex, IconButton } from '../../../../allcll-ui';

function ScheduleSlotList() {
  const currentTimetable = useScheduleState(s => s.currentTimetable);

  const { data: schedules } = useTimetableSchedules(currentTimetable?.timeTableId);
  const scheduleSlots = getEmptyScheduleSlots(schedules);

  return (
    <Flex direction="flex-col" gap="gap-2" className="mt-3">
      {scheduleSlots
        // .filter(schedule => !schedule.selected)
        .map(schedule => (
          <EmptyScheduleSlot key={schedule.scheduleId} schedule={schedule} selected={schedule.selected} />
        ))}
    </Flex>
  );
}

function EmptyScheduleSlot({ schedule, selected }: Readonly<{ schedule: GeneralSchedule; selected: boolean }>) {
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
      <Flex gap="gap-5">
        <p>{schedule.subjectName}</p>
        <p className="text-stone-400">{schedule.professorName}</p>
      </Flex>

      <IconButton
        aria-label="delete"
        variant="plain"
        label="delete"
        icon={<XGraySvg className="w-5 h-5" />}
        onClick={handleDeleteEmptySlot}
      />
    </div>
  );
}

export default ScheduleSlotList;
