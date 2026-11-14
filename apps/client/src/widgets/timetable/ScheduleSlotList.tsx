import { GeneralSchedule } from '@/entities/timetable/api/useTimetableSchedules.ts';
import { useEmptyScheduleSlots } from '@/features/timetable/model/useScheduleSlots.ts';
import { CloseIcon, Flex, IconButton } from '@allcll/allcll-ui';
import useScheduleModal from '@/features/timetable/lib/useScheduleModal.ts';

interface IScheduleSlotList {
  schedules: GeneralSchedule[];
}

function ScheduleSlotList({ schedules }: IScheduleSlotList) {
  const scheduleSlots = useEmptyScheduleSlots(schedules);

  return (
    <Flex direction="column" gap={2} className="mt-3">
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
        (selected ? 'bg-primary-muted border-primary-500' : 'border-line')
      }
    >
      <Flex gap={5}>
        <p>{schedule.subjectName}</p>
        <p className="text-fg-subtle">{schedule.professorName}</p>
      </Flex>

      <IconButton
        size="large"
        aria-label="delete"
        variant="plain"
        label="delete"
        icon={<CloseIcon className="text-fg-muted" />}
        onClick={handleDeleteEmptySlot}
      />
    </div>
  );
}

export default ScheduleSlotList;
