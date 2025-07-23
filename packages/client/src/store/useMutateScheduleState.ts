import { create } from 'zustand';
import { CustomSchedule, OfficialSchedule } from '@/hooks/server/useTimetableData.ts';

export enum ScheduleMutateType {
  NONE = 'none',
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

export interface IMutateScheduleState {
  timetableId?: number;
  mode: ScheduleMutateType;
  setTimetableId: (timetableId: number) => void;
  changeScheduleData: (schedule: Partial<OfficialSchedule | CustomSchedule>, mode?: ScheduleMutateType) => void;
  schedule: OfficialSchedule | CustomSchedule;
}

export const useMutateScheduleState = create<IMutateScheduleState>(set => ({
  timetableId: 1,
  mode: ScheduleMutateType.NONE,
  schedule: {
    scheduleId: 0,
    scheduleType: 'official',
    subjectId: 0,
    subjectName: null,
    professorName: null,
    location: null,
    timeslots: [],
  },

  setTimetableId: (timetableId: number) => {
    set(state => ({
      ...state,
      timetableId,
    }));
  },

  changeScheduleData: (schedule, mode) => {
    set(state => ({
      ...state,
      mode: mode ?? state.mode,
      schedule: {
        ...state.schedule,
        ...schedule,
      } as OfficialSchedule | CustomSchedule,
    }));
  },
}));
