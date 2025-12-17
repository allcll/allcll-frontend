import { TimeSlot } from '@/entities/timetable/api/useTimetableSchedules';
import { parseTime, reconcileTimeString } from './time';

export type TimeKey = 'startHour' | 'startMinute' | 'endHour' | 'endMinute';

export function updateTimeSlot(slot: TimeSlot, key: TimeKey, value: string) {
  const start = parseTime(slot.startTime);
  const end = parseTime(slot.endTime);

  let newStart = start;
  let newEnd = end;

  switch (key) {
    case 'startHour':
      newStart = { ...start, hour: value };
      break;
    case 'startMinute':
      newStart = { ...start, minute: value };
      break;
    case 'endHour':
      newEnd = { ...end, hour: value };
      break;
    case 'endMinute':
      newEnd = { ...end, minute: value };
      break;
  }

  return {
    ...slot,
    startTime: reconcileTimeString(newStart),
    endTime: reconcileTimeString(newEnd),
  };
}
