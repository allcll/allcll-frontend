import { create, StoreApi, UseBoundStore } from 'zustand';
import { Credit, Day, DepartmentType, Grade, RangeMinMaxFilter, RemarkType } from '@/shared/model/types.ts';
import { IDayTimeItem } from '@/features/filtering/ui/DayTimeFilter.tsx';
import { getLabelByFilters } from '@/features/filtering/lib/getFilteringFormatter.ts';

export interface Filters {
  keywords: string;
  department: string;
  grades: Grade[];
  credits: Credit[];
  categories: string[];
  seatRange: RangeMinMaxFilter | null;
  wishRange: RangeMinMaxFilter | null;
  time: IDayTimeItem[];
  days: Day[];
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
  time: [],
  days: [],
  classroom: [],
  note: [],
  language: [],
  alarmOnly: false,
  favoriteOnly: false,
};

export function isFilterEmpty<T extends keyof Filters>(key: T, value: Filters[T]) {
  if (key === 'time' && Array.isArray(value))
    return value.length === 0 || (value.length === 1 && (value[0] as IDayTimeItem).day === '');
  if (Array.isArray(initialFilters[key]) && Array.isArray(value)) return value.length === 0;
  return !value;
}

function isValidFilterValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== '' && value !== false;
}

export function getAllSelectedLabels(filters: Filters, departments?: DepartmentType[]) {
  const result = [];

  for (const key in filters) {
    const values = filters[key as keyof Filters];

    if (key === 'time') {
      const { day, type } = values as IDayTimeItem;

      if (!day || !type) continue;
    }

    if (key === 'keywords' || key === 'favoriteOnly' || key === 'alarmOnly') continue;
    if (Array.isArray(values) && values.length > 0) {
      values.forEach(value => {
        if (isValidFilterValue(value)) {
          result.push({
            filterKey: key as keyof Filters,
            values: value,
            label: getLabelByFilters(key as keyof Filters, value as Filters[keyof Filters], departments),
          });
        }
      });
    }

    if (!Array.isArray(values) && isValidFilterValue(values)) {
      result.push({
        filterKey: key as keyof Filters,
        values: values,
        label: values !== null ? getLabelByFilters(key as keyof Filters, values, departments) : '',
      });
    }
  }

  return result;
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
