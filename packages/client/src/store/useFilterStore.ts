import { create, StoreApi, UseBoundStore } from 'zustand';
import { Curitype, Grade, RangeFilter, RemarkType } from '@/utils/types.ts';
import { IDayTimeItem } from '@/components/contentPanel/filter/DayTimeFilter.tsx';

export interface Filters {
  keywords: string;
  department: string;
  grades: Grade[];
  credits: number[];
  categories: Curitype[];
  seatRange: RangeFilter | null;
  wishRange: RangeFilter | null;
  time: IDayTimeItem[];
  classroom: string[];
  note: RemarkType[];
  language: string[]; // 한국어/영어, 영어
  alarmOnly: boolean;
  favoriteOnly: boolean;
}

interface IFilterStore {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
}

export const initialFilters: Filters = {
  keywords: '',
  department: '',
  grades: [],
  credits: [],
  categories: [],
  seatRange: null,
  wishRange: null,
  time: [],
  classroom: [],
  note: [],
  language: [],
  alarmOnly: false,
  favoriteOnly: false,
};

export function isFilterEmpty<T extends keyof Filters>(key: T, value: Filters[T]) {
  if (Array.isArray(initialFilters[key]) && Array.isArray(value)) return value.length === 0;
  return !value;
}

const createFilterStore = () =>
  create<IFilterStore>(set => ({
    filters: { ...initialFilters },
    setFilter: (key, value) => set(state => ({ filters: { ...state.filters, [key]: value } })),
    resetFilters: () => set({ filters: initialFilters }),
  }));

export type FilterStore = UseBoundStore<StoreApi<IFilterStore>>;

export const useScheduleSearchStore = createFilterStore();
export const useAlarmSearchStore = createFilterStore();
export const useWishSearchStore = createFilterStore();
