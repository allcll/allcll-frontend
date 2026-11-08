import { create, StoreApi, UseBoundStore } from 'zustand';
import { Credit, DayTimeRanges, Grade, RangeMinMaxFilter, RemarkType } from '@/features/filtering/model/types.ts';
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
  dayTimes: DayTimeRanges | null;
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
  dayTimes: null,
  classroom: [],
  note: [],
  language: [],
  alarmOnly: false,
  favoriteOnly: false,
};

const createFilterStore = () =>
  create<IFilterStore>(set => ({
    filters: { ...initialFilters },
    setFilter: (key, value) =>
      set(state => {
        const filters = { ...state.filters, [key]: value };
        if (key === 'days' && filters.dayTimes) {
          filters.dayTimes = filters.days.length
            ? Object.fromEntries(Object.entries(filters.dayTimes).filter(([day]) => filters.days.includes(day as Day)))
            : null;
        }
        return { filters };
      }),
    // 검색어는 검색칸에서 따로 지우므로 필터 초기화에서는 남김
    resetFilters: () => set(state => ({ filters: { ...initialFilters, keywords: state.filters.keywords } })),
  }));

export type FilterStore = UseBoundStore<StoreApi<IFilterStore>>;

export const useScheduleSearchStore = createFilterStore();
export const useAlarmSearchStore = createFilterStore();
export const useWishSearchStore = createFilterStore();
