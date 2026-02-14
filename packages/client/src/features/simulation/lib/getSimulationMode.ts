import { TimetableType } from '@/entities/timetable/api/useTimetableSchedules';

export const getInitSimulationMode = (hasPrevSnapshot: boolean, timetables: TimetableType[]) => {
  if (hasPrevSnapshot) {
    return 'previous';
  }
  if (timetables.length > 0) {
    return 'timetable';
  }
  return 'random';
};
