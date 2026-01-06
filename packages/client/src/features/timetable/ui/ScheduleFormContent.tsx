import { Day } from '@/shared/model/types.ts';
import { Chip, Flex, Label, TextField } from '@allcll/allcll-ui';
import { extractTimeRange, toggleDaySlot } from '../lib/time.ts';
import useScheduleModal, { useScheduleModalData } from '../lib/useScheduleModal.ts';
import { updateTimeSlot } from '../lib/updateTimeSlot.ts';
import { useScheduleState } from '../model/useScheduleState.ts';
import { DAYS } from '../model/types.ts';
import SelectTime from './SelectTime.tsx';

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

function ScheduleFormContent() {
  const isMobile = useScheduleState(state => state.options.isMobile);

  const { schedule: scheduleForm } = useScheduleModalData();
  const { editSchedule: setScheduleForm } = useScheduleModal();

  const textFields = [
    {
      id: 'subjectName',
      name: '과목명',
      value: scheduleForm?.subjectName ?? '',
    },
    {
      id: 'professorName',
      name: '교수명',
      value: scheduleForm?.professorName ?? '',
    },
    {
      id: 'location',
      name: '장소',
      value: scheduleForm?.location ?? '',
    },
  ];

  const toggleDay = (day: Day) => {
    setScheduleForm(prev => ({
      ...prev,
      timeSlots: toggleDaySlot(prev.timeSlots, day),
    }));
  };

  const handleFormChange = (key: keyof TimeRange, value: string, targetDay?: Day) => {
    setScheduleForm(prev => {
      const updated = prev.timeSlots.map(slot => {
        if (slot.dayOfWeeks === targetDay) {
          return updateTimeSlot(slot, key, value);
        }
        return slot;
      });

      return { ...prev, timeSlots: updated };
    });
  };

  return (
    <Flex direction="flex-col" gap={isMobile ? 'gap-4' : 'gap-5'}>
      {textFields.map(({ id, name, value }) => (
        <TextField
          key={id}
          size="medium"
          id={id}
          placeholder={`${name}을 입력해주세요`}
          value={value}
          label={name}
          onChange={e => setScheduleForm(prev => ({ ...prev, [id]: e.target.value }))}
          required={true}
        />
      ))}

      <Flex gap="gap-2" direction="flex-col">
        <Label>요일</Label>
        <Flex direction="flex-wrap">
          {DAYS.map(day => (
            <Chip
              key={day}
              label={day}
              selected={scheduleForm.timeSlots.some(slot => slot.dayOfWeeks === day)}
              onClick={() => toggleDay(day)}
            />
          ))}
        </Flex>
      </Flex>

      {scheduleForm.timeSlots.map(slot => (
        <Flex key={slot.dayOfWeeks} direction="flex-col" gap="gap-4">
          <Label>{slot.dayOfWeeks}</Label>
          <SelectTime
            day={slot.dayOfWeeks}
            timeRange={extractTimeRange(slot.startTime, slot.endTime)}
            onChange={handleFormChange}
          />
        </Flex>
      ))}
    </Flex>
  );
}

export default ScheduleFormContent;
