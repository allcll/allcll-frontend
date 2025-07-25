import { create } from 'zustand';
import { Schedule, TimetableType } from '@/hooks/server/useTimetableData.ts';

export enum ScheduleMutateType {
  NONE = 'none',
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

export interface IMutateScheduleState {
  currentTimetable: TimetableType;
  options: {
    timetableRef: HTMLDivElement | null;
    colNames: string[];
    rowNames: string[];
    tableX: number;
    tableY: number;
    width: number;
    height: number;
    cols: number;
    rows: number;
  };
  mode: ScheduleMutateType;
  pickTimetable: (timetable: TimetableType) => void;
  setOptions: (options: Partial<IMutateScheduleState['options']>) => void;
  changeScheduleData: (schedule: Partial<Schedule>, mode?: ScheduleMutateType) => void;
  schedule: Schedule;
}

export const useScheduleState = create<IMutateScheduleState>(set => ({
  currentTimetable: {
    timeTableId: -1,
    timeTableName: '새 시간표',
    semester: '',
  },
  options: {
    timetableRef: null,
    colNames: [],
    rowNames: [],
    tableX: 0,
    tableY: 0,
    width: 0,
    height: 0,
    cols: 5,
    rows: 11,
  },
  mode: ScheduleMutateType.NONE,
  schedule: {
    scheduleId: 0,
    scheduleType: 'official',
    subjectId: 0,
    subjectName: '',
    professorName: '',
    location: '',
    timeslots: [],
  },

  pickTimetable: (timetable: TimetableType) => {
    set(state => ({
      ...state,
      currentTimetable: timetable,
    }));
  },

  setOptions: (options: Partial<IMutateScheduleState['options']>) => {
    set(state => ({
      ...state,
      options: {
        ...state.options,
        ...options,
      },
    }));
  },

  changeScheduleData: (schedule, mode) => {
    set(state => ({
      ...state,
      mode: mode ?? state.mode,
      schedule: {
        ...state.schedule,
        ...schedule,
      },
    }));
  },
}));
