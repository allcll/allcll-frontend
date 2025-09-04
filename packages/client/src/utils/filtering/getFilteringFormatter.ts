import { IDayTimeItem } from '@/components/filtering/DayTimeFilter';
import { FilterOptions } from './filterDomains';
import { Filters } from '@/store/useFilterStore';
import { RangeMinMaxFilter } from '../types';

export const labelPrefix: Record<keyof Filters, string> = {
  keywords: '키워드',
  department: '학과',
  grades: '학년',
  credits: '학점',
  classroom: '강의실',
  seatRange: '여석',
  wishRange: '관심 인원',
  time: '요일',
  categories: '수업 유형',
  note: '비고',
  language: '언어',
  alarmOnly: '알림',
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

  if (filterKey === 'seatRange') {
    const label = getLabelFormatter()[filterKey]?.(selectedValue) ?? labelPrefix[filterKey];
    return `여석 ${label}`;
  }

  if (filterKey === 'wishRange') {
    const label = getLabelFormatter()[filterKey]?.(selectedValue) ?? labelPrefix[filterKey];
    return `관심 인원 ${label}`;
  }

  return getLabelFormatter()[filterKey]?.(selectedValue) ?? labelPrefix[filterKey];
}

export function getLabelByFilters<K extends keyof Filters>(
  filterKey: keyof Filters,
  selectedValue: FilterValueType<K> | null,
) {
  const formattedLabel = getLabelFormatter()[filterKey]?.(selectedValue);
  if (filterKey === 'seatRange') {
    return `여석 ${formattedLabel}`;
  }

  if (filterKey === 'wishRange') {
    return `관심 ${formattedLabel}`;
  }

  return getLabelFormatter()[filterKey]?.(selectedValue);
}

const getClassRoomLabel = (value: string) => {
  return FilterOptions.classRoom.find(room => room.value === value)?.label || value;
};

const getRangeLabel = (value: RangeMinMaxFilter) => {
  const { min, max } = value;

  if (min !== undefined && max !== undefined) {
    return `${min}개 이상 ~ ${max}개 이하`;
  }

  if (min !== undefined) {
    return `${min}개 이상`;
  }
  if (max !== undefined) {
    return `${max}개 이하`;
  }

  return '';
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
