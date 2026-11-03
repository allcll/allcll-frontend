import { create, StoreApi, UseBoundStore } from 'zustand';
import { Credit, Grade, RangeMinMaxFilter, RemarkType } from '@/features/filtering/model/types.ts';
import { Day } from '@/entities/timetable/model/types.ts';

export interface Filters {
  keywords: string;
  department: string;
  grades: Grade[];
  credits: Credit[];
  categories: string[];
  seatRange: RangeMinMaxFilter | null;
  wishRange: RangeMinMaxFilter | null;
  days: Day[];
  time: RangeMinMaxFilter | null;
  classroom: string[];
  note: RemarkType[];
  language: string[]; // 한국어/영어, 영어
  alarmOnly: boolean;
  favoriteOnly: boolean;
}

interface IFilterStore {
  filters: Filters;
  setFilter: <K extends keyof Filters, VALUE>(key: K, value: VALUE) => void;
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
  days: [],
  time: null,
  classroom: [],
  note: [],
  language: [],
  alarmOnly: false,
  favoriteOnly: false,
};

const createFilterStore = () =>
  create<IFilterStore>(set => ({
    filters: { ...initialFilters },
    setFilter: (key, value) => set(state => ({ filters: { ...state.filters, [key]: value } })),
    // 검색어는 검색칸에서 따로 지우므로 필터 초기화에서는 남김
    resetFilters: () => set(state => ({ filters: { ...initialFilters, keywords: state.filters.keywords } })),
  }));

export type FilterStore = UseBoundStore<StoreApi<IFilterStore>>;

export const useScheduleSearchStore = createFilterStore();
export const useAlarmSearchStore = createFilterStore();
export const useWishSearchStore = createFilterStore();
