import { IDayTimeItem } from '@/features/filtering/ui/DayTimeFilter.tsx';
import { getLabelByFilters } from '@/features/filtering/lib/getFilteringFormatter.ts';
import { Filters, initialFilters } from '@/features/filtering/model/useFilterStore.ts';
import { DepartmentType } from '@/features/filtering/model/types.ts';

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
