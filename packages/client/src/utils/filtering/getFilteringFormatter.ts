import { IDayTimeItem } from '@/components/filtering/DayTimeFilter';
import { FilterOptions } from './filterDomains';
import { Filters } from '@/store/useFilterStore';

export const labelPrefix: Record<keyof Filters, string> = {
  keywords: '키워드',
  department: '학과',
  grades: '학년',
  credits: '학점',
  classroom: '강의실',
  seatRange: '여석',
  wishRange: '관심 과목',
  time: '요일',
  categories: '카테고리',
  note: '비고',
  language: '언어',
  alarmOnly: '알람',
  favoriteOnly: '즐겨찾기',
};

type FilterValueType<K extends keyof Filters> = Filters[K] extends (infer U)[] ? U : Filters[K];

export function getMultiSelectedLabel<K extends keyof Filters>(
  filterKey: K,
  selectedValues: FilterValueType<K>[],
): string {
  if (!selectedValues || selectedValues.length === 0) {
    return labelPrefix[filterKey];
  }

  if (selectedValues.length === 1) {
    return getLabelFormatter()[filterKey]?.(selectedValues[0]) ?? labelPrefix[filterKey];
  }

  return `${getLabelFormatter()[filterKey]?.(selectedValues[0]) ?? labelPrefix[filterKey]} 외 ${selectedValues.length - 1}개`;
}

export function getSingleSelectedLabel<K extends keyof Filters>(
  filterKey: keyof Filters,
  selectedValue: FilterValueType<K> | null,
): string {
  if (!selectedValue) {
    return labelPrefix[filterKey];
  }

  return getLabelFormatter()[filterKey]?.(selectedValue) ?? labelPrefix[filterKey];
}

export function getLabelByFilters<K extends keyof Filters>(
  filterKey: keyof Filters,
  selectedValue: FilterValueType<K> | null,
) {
  if (filterKey === 'time') {
    const { day, type } = selectedValue as { day?: string; type?: string };
    if (!day) return null;
    return `${day} ${type ?? ''}`.trim();
  }

  return getLabelFormatter()[filterKey]?.(selectedValue);
}

const getClassRoomLabel = (value: string) => {
  return FilterOptions.classRoom.find(room => room.value === value)?.label || value;
};

const getRangeLabel = (value: { operator: 'over-equal' | 'under-equal'; value: number }) => {
  const operatorLabel = value.operator === 'over-equal' ? '이상' : '이하';
  return `${value.value} ${operatorLabel}`;
};

const getTimesLabel = (value: IDayTimeItem) => {
  return `${value.day}${labelPrefix.time} ${value.start}~${value.end}`;
};

const getLableWithSuffix = (value: string | number, labelSuffix: string) => {
  return value + labelSuffix;
};

export function getLabelFormatter(): Partial<Record<keyof Filters, (value: any) => string>> {
  return {
    keywords: value => value,
    department: value => value,
    grades: value => getLableWithSuffix(value, labelPrefix.grades),
    credits: value => getLableWithSuffix(value, labelPrefix.credits),
    classroom: getClassRoomLabel,
    seatRange: getRangeLabel,
    wishRange: getRangeLabel,
    time: getTimesLabel,
    categories: value => value,
    note: value => value,
    language: value => value,
    alarmOnly: value => value,
    favoriteOnly: value => value,
  };
}
