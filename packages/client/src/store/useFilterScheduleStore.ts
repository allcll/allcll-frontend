import { create } from 'zustand';
import { Curitype, Day, Grade } from '@/utils/types';

interface FilterState {
  selectedDepartment: string;
  selectedGrades: Grade[];
  selectedDays: Day[];
  selectedCredits: number[];
  selectedCuriTypes: Curitype[];
  setFilterSchedule: <K extends keyof Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule'>>(
    key: K,
    value: FilterState[K],
  ) => void;
  resetFilterSchedule: () => void;
  getFilterSchedule: () => Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule' | 'getFilterSchedule'>;
}

const initialState: Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule' | 'getFilterSchedule'> = {
  selectedDepartment: '',
  selectedGrades: [],
  selectedDays: [],
  selectedCredits: [],
  selectedCuriTypes: [],
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
