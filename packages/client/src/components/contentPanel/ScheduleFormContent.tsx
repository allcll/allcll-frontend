import SelectTime from './SelectTime';
import { Day, DAYS } from '@/utils/types';
import Chip from '@common/components/chip/Chip';
import useScheduleModal, { useScheduleModalData } from '@/hooks/useScheduleModal.ts';
import { useScheduleState } from '@/store/useScheduleState';
import { Flex, Label, TextField } from '@allcll/allcll-ui';

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

function ScheduleFormContent() {
  const { schedule: scheduleForm } = useScheduleModalData();
  const { editSchedule: setScheduleForm } = useScheduleModal();

  const isMobile = useScheduleState(state => state.options.isMobile);

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

  const extractTimeParts = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    return { startHour, startMinute, endHour, endMinute };
  };

  const toggleDay = (day: Day) => {
    const exists = scheduleForm.timeSlots.find(slot => slot.dayOfWeeks === day);

    if (exists) {
      setScheduleForm(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter(slot => slot.dayOfWeeks !== day),
      }));
    } else {
      setScheduleForm(prev => ({
        ...prev,
        timeSlots: [
          ...prev.timeSlots,
          {
            dayOfWeeks: day,
            startTime: '',
            endTime: '',
          },
        ],
      }));
    }
  };

  const onScheduleFormChange = (key: keyof TimeRange, value: string, targetDay?: Day) => {
    const parseValue = (timeSlot: string) => {
      let [hour, minute] = timeSlot.split(':').map(Number);

      if (isNaN(hour)) hour = 9;
      if (isNaN(minute)) minute = 0;

      return [hour.toString(), minute.toString().padStart(2, '0')];
    };

    const reconcileTimeString = (timeString: string) => {
      const [hour, minute] = parseValue(timeString);
      return `${hour}:${minute}`;
    };

    setScheduleForm(prev => {
      const updated = prev.timeSlots.map(slot => {
        console.log(slot);

        if (slot.dayOfWeeks !== targetDay) return slot;

        const [startHour, startMinute] = parseValue(slot.startTime);
        const [endHour, endMinute] = parseValue(slot.endTime);

        let newStartTime = slot.startTime;
        let newEndTime = slot.endTime;

        if (key === 'startHour') newStartTime = `${value}:${startMinute}`;
        if (key === 'startMinute') newStartTime = `${startHour}:${value}`;
        if (key === 'endHour') newEndTime = `${value}:${endMinute}`;
        if (key === 'endMinute') newEndTime = `${endHour}:${value}`;

        return {
          ...slot,
          startTime: reconcileTimeString(newStartTime),
          endTime: reconcileTimeString(newEndTime),
        };
      });

      return { ...prev, timeSlots: updated };
    });
  };

  return (
    <Flex direction="flex-col" gap={isMobile ? 'gap-4' : 'gap-5'}>
      {textFields.map(({ id, name, value }) => (
        <TextField
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
        <Flex key={slot.dayOfWeeks} direction="flex-col" gap="gap-2">
          <Label>{slot.dayOfWeeks}</Label>
          <SelectTime
            day={slot.dayOfWeeks}
            timeRange={extractTimeParts(slot.startTime, slot.endTime)}
            onChange={onScheduleFormChange}
          />
        </Flex>
      ))}
    </Flex>
  );
}

export default ScheduleFormContent;
