import { create } from 'zustand';
import { Schedule } from '@/hooks/server/useTimetableData.ts';

export enum ScheduleMutateType {
  NONE = 'none',
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

export interface IMutateScheduleState {
  timetableId?: number;
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
  setTimetableId: (timetableId: number) => void;
  setOptions: (options: Partial<IMutateScheduleState['options']>) => void;
  changeScheduleData: (schedule: Partial<Schedule>, mode?: ScheduleMutateType) => void;
  schedule: Schedule;
}

export const useScheduleState = create<IMutateScheduleState>(set => ({
  timetableId: 1,
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

  setTimetableId: (timetableId: number) => {
    set(state => ({
      ...state,
      timetableId,
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
