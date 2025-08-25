import { create } from 'zustand';
import { Curitype, Day, Grade } from '@/utils/types';

interface FilterState {
  selectedDepartment: string;
  selectedGrades: Grade[];
  selectedDays: Day[];
  selectedCredits: number[];
  selectedCuriTypes: Curitype[];
  selectedSeatRange: number;
  selectedWishRange: number;
  setFilterSchedule: <K extends keyof Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule'>>(
    key: K,
    value: FilterState[K],
  ) => void;
  resetFilterSchedule: () => void;
}

const initialState: Omit<FilterState, 'setFilterSchedule' | 'resetFilterSchedule' | 'getFilterSchedule'> = {
  selectedDepartment: '',
  selectedGrades: [],
  selectedDays: [],
  selectedCredits: [],
  selectedCuriTypes: [],
  selectedSeatRange: -1,
  selectedWishRange: -1,
};

/** @deprecated */
export const useFilterScheduleStore = create<FilterState>(set => ({
  ...initialState,
  setFilterSchedule: (key, value) => set(state => ({ ...state, [key]: value })),
  resetFilterSchedule: () => set(initialState),
}));
