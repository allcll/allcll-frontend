import { TimeSlot } from '@/entities/timetable/api/useTimetableSchedules.ts';

import { Day } from '@/features/filtering/model/types.ts';

export const extractTimeRange = (startTime: string, endTime: string) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  return {
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
  };
};

export interface TimeParts {
  hour: string;
  minute: string;
}

const DEFAULT_TIME: TimeParts = { hour: '10', minute: '00' };

export const parseTime = (time: string, fallback = DEFAULT_TIME): TimeParts => {
  let [hour, minute] = time.split(':').map(Number);

  if (Number.isNaN(hour)) hour = Number(fallback.hour);
  if (Number.isNaN(minute)) minute = Number(fallback.minute);

  return {
    hour: hour.toString(),
    minute: minute.toString().padStart(2, '0'),
  };
};

export const reconcileTimeString = (timeParts: TimeParts) => {
  const { hour, minute } = timeParts;
  return `${hour}:${minute}`;
};

export function toggleDaySlot(slots: TimeSlot[], day: Day): TimeSlot[] {
  const exists = slots.some(slot => slot.dayOfWeeks === day);

  return exists
    ? slots.filter(slot => slot.dayOfWeeks !== day)
    : [...slots, { dayOfWeeks: day, startTime: '', endTime: '' }];
}
