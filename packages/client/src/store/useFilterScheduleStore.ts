import { create } from 'zustand';
import { Day, Grade } from '@/utils/types';

interface TimeRange {
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
}

interface FilterState {
  selectedDepartment: string;
  selectedGrades: Grade[];
  isMajor?: boolean;
  selectedDays: Day[];
  selectedTimeRange: TimeRange;
  setFilterSchedule: <K extends keyof Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule'>>(
    key: K,
    value: FilterState[K],
  ) => void;
  resetFilterSchedule: () => void;
  getFilterSchedule: () => Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule' | 'getFilterSchedule'>;
}

const initialState: Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule' | 'getFilterSchedule'> = {
  selectedDepartment: '전체',
  selectedGrades: [],
  isMajor: undefined,
  selectedDays: [],
  selectedTimeRange: {
    startHour: '9시',
    startMinute: '0분',
    endHour: '10시',
    endMinute: '0분',
  },
};

export const useFilterScheduleStore = create<FilterState>((set, get) => ({
  ...initialState,
  setFilterSchedule: (key, value) => set(state => ({ ...state, [key]: value })),
  resetFilterSchedule: () => set(initialState),
  getFilterSchedule: () => {
    const state = get();
    const { setFilterSchedule, resetFilterSchedule, getFilterSchedule, ...pureState } = state;
    return pureState;
  },
}));
