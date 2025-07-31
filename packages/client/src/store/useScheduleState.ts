import { create } from 'zustand';
import { GeneralSchedule, TimetableType } from '@/hooks/server/useTimetableSchedules.ts';
import { ScheduleAdapter } from '@/utils/timetable/adapter.ts';
import { Day, DAYS } from '@/utils/types.ts';

export enum ScheduleMutateType {
  NONE = 'none',
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

export interface IMutateScheduleState {
  currentTimetable: TimetableType;
  options: {
    containerRef: HTMLDivElement | null;
    timetableRef: HTMLDivElement | null;
    colNames: Day[];
    rowNames: string[];
    minTime: number;
    maxTime: number;
    tableX: number;
    tableY: number;
    width: number;
    height: number;
    cols: number;
    rows: number;
    isMobile: boolean;
  };
  mode: ScheduleMutateType;
  pickTimetable: (timetable: TimetableType) => void;
  setOptions: (options: Partial<IMutateScheduleState['options']>) => void;
  changeScheduleData: (schedule: Partial<GeneralSchedule>, mode?: ScheduleMutateType) => void;
  schedule: GeneralSchedule;
}

export const useScheduleState = create<IMutateScheduleState>(set => ({
  currentTimetable: {
    timeTableId: -1,
    timeTableName: '새 시간표',
    semester: '',
  },
  options: {
    containerRef: null,
    timetableRef: null,
    colNames: DAYS.slice(0, 5),
    rowNames: Array.from({ length: 12 }, (_, i) => `${i + 9}`),
    minTime: 9,
    maxTime: 20,
    tableX: 0,
    tableY: 0,
    width: 0,
    height: 0,
    cols: 5,
    rows: 11,
    isMobile: false,
  },
  mode: ScheduleMutateType.NONE,
  schedule: new ScheduleAdapter().toUiData(),

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
